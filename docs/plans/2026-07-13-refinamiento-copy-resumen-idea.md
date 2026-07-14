# Refinamiento de copy: resumen de la idea, explicación de cambios y título — Plan de implementación

## 1. Objetivo

Reescribir tres piezas de copy y presentación ya construidas, sin tocar lógica ni datos: el resumen "Así construiste tu idea" pasa a leerse como una idea conectada, el texto de explicación al cambiar una pieza pasa a explicar también el efecto sobre el resto de la historia (máximo 2 renglones), y el título de la app se corrige de voseo a español neutro. Al terminar el plan, la app se ve y se comporta igual que hoy en todo lo demás: mismos estados, misma lógica, mismos colores, mismo resaltado de texto.

## 2. Contexto del problema

El resumen de piezas se lee hoy como cuatro etiquetas sueltas, sin conexión visible entre ellas, y el texto de "Cambia una pieza" solo nombra la categoría modificada sin explicar su efecto sobre el resto — ninguno de los dos refuerza la idea central del producto de que una idea se arma combinando piezas conectadas (`CLAUDE.md §4`). El título usa voseo, inconsistente con el español neutro del resto del proyecto. El detalle completo de "por qué" está en la spec de referencia.

## 3. Spec de referencia

`docs/specs/2026-07-13-refinamiento-copy-resumen-idea.md` — aprobada por Leo. El plan cubre el Alcance v1 completo de esa spec: los tres ajustes de copy/presentación, sin tocar lógica de estado, generación de historias, colores de categoría, ni el resaltado de texto existente.

## 4. Lista de tareas a implementar

### Tarea 1 — Conectores narrativos para el resumen (`src/components/StorySummary.jsx`)

**Qué hace:** Agrega una palabra conectora breve antes de cada tarjeta, para que el conjunto se lea como una frase ("🤖 Un robot **que** 🍳 cocina 🚀 en el espacio**,** 😄 de forma divertida") en vez de una fila de tarjetas sueltas.

**Dónde toca:** `src/components/StorySummary.jsx`.

**Detalles técnicos:**
- Se revisó el texto de cada categoría en `src/data/blocks.js`: las opciones de `lugar` ya empiezan con "en" (`en el espacio`, `en la selva`...) y las de `estilo` ya empiezan con "de forma" (`de forma divertida`...), así que esas dos categorías no necesitan una palabra conectora propia — alcanza con puntuación. `accion` (`cocina`, `explora`...) sí necesita la palabra "que" para leerse como frase. `personaje` es siempre la primera pieza, no lleva conector.
- Se agrega una constante local `CONNECTORS = { personaje: '', accion: 'que', lugar: '', estilo: ',' }` (o estructura equivalente), indexada por `block.id`, con el texto que va **antes** de cada tarjeta.
- En el `.map(BLOCKS)` existente, antes de renderizar cada `story-summary__chip`, se renderiza el conector correspondiente (si no está vacío) dentro de un `<span className="story-summary__connector">`. No se renderiza nada si el conector es `''`.
- No se toca la prop `highlightedCategoryIndex` ni la lógica de resaltado existente (`story-summary__chip--highlighted`): se aplica igual que hoy, sobre la misma tarjeta, ahora rodeada de los conectores.
- No se toca `story-summary__title` ("Así construiste tu idea"): la spec pide cambiar cómo se leen las piezas debajo del título, no el título en sí.

**De qué parte del spec sale:** `Comportamiento esperado §Resumen "Así construiste tu idea"` — incluye el ejemplo textual exacto que define el orden y los conectores.

### Tarea 2 — Estilos del conector (`src/components/StorySummary.css`)

**Qué hace:** Da estilo al nuevo `story-summary__connector` para que se vea como texto secundario (más chico, color apagado) y no compita visualmente con las tarjetas de colores, y ajusta el layout de `story-summary__chips` para que las tarjetas y los conectores fluyan en línea como una oración, conservando el `flex-wrap` para que siga funcionando en pantallas angostas.

**Dónde toca:** `src/components/StorySummary.css`.

**Detalles técnicos:**
- Nueva regla `.story-summary__connector`: `font-size` menor al texto de las tarjetas (por ejemplo `0.85rem`), color gris (consistente con `story-summary__title`, que ya usa `#6b7280`), sin peso extra (`font-weight: 400`), alineado verticalmente con las tarjetas (`display: flex; align-items: center` en el contenedor ya lo resuelve).
- `.story-summary__chips` mantiene `display: flex; flex-wrap: wrap; gap` (el `gap` puede reducirse levemente, por ejemplo de `0.75rem` a `0.5rem`, para que la frase se lea más junta) y `align-items: center` para que el conector y las tarjetas queden alineados en el eje vertical.
- No se toca ninguna regla de color por categoría (`--block-color`) ni `story-summary__chip--highlighted`.

**De qué parte del spec sale:** `Comportamiento esperado §Resumen "Así construiste tu idea"` y `Posibles errores y mitigaciones` — "las palabras conectoras deben verse claramente como texto secundario... para que las piezas... sigan siendo lo más visible".

### Tarea 3 — Copy de las 8 variantes de explicación (`src/data/changeExplanations.js`)

**Qué hace:** Reemplaza el texto de `CHANGE_EXPLANATIONS` y `SURPRISE_EXPLANATIONS` por el copy final definido en la spec, que en cada caso explica qué pieza cambió y el efecto sobre el resto de la historia, en máximo 2 renglones.

**Dónde toca:** `src/data/changeExplanations.js`. No se toca `src/components/ComparisonCard.jsx`: ya consume estos dos objetos tal cual, sin cambios de props ni de estructura.

**Detalles técnicos — texto final** (tomado literal de la spec `§Comportamiento esperado → Explicación al cambiar una pieza`):

```js
export const CHANGE_EXPLANATIONS = {
  personaje: 'Cambiaste el personaje. Con otro protagonista, toda la historia se siente distinta.',
  accion: 'Cambiaste la acción. Con algo distinto ocurriendo, la historia cambia de ritmo.',
  lugar: 'Cambiaste el lugar. En otro escenario, la misma historia se ve completamente distinta.',
  estilo: 'Cambiaste el estilo. Con otro ánimo, la misma historia se siente como una idea nueva.',
}

export const SURPRISE_EXPLANATIONS = {
  personaje: (valor) =>
    `Cambiamos el personaje. Ahora es ${valor}, y toda la historia se lee distinta a su alrededor.`,
  accion: (valor) => `Cambiamos la acción. Ahora ${valor}, y eso le da otro ritmo a toda la historia.`,
  lugar: (valor) =>
    `Cambiamos el lugar. Ahora la historia sucede ${valor}, y se siente completamente distinta.`,
  estilo: (valor) => `Cambiamos el estilo. Ahora es ${valor}, y la misma idea se siente como otra historia.`,
}
```

- La firma de ambos exports no cambia (mismas claves, `SURPRISE_EXPLANATIONS` sigue siendo funciones de `valor`), así que `ComparisonCard.jsx` no requiere ningún cambio.
- El límite de 2 renglones se verifica con **el escritorio como referencia**, según indicó Leo: una primera versión acortada para garantizar 2 renglones también en celular quedaba "boba" de lo corta y repetitiva entre categorías, así que se descartó. Se probó en el navegador, en escritorio, con el valor más largo disponible por categoría (por ejemplo "de forma sorprendente" para estilo) y el texto entra en 2 renglones. En celular puede ocupar más de 2 renglones — aceptado conscientemente, no es un bug pendiente.

**De qué parte del spec sale:** `Comportamiento esperado §Explicación al cambiar una pieza` — incluye el texto literal de las 8 variantes.

### Tarea 4 — Corregir el título (`src/App.jsx`)

**Qué hace:** Cambia el texto del `<h1>` de voseo a español neutro.

**Dónde toca:** `src/App.jsx`, línea del `<h1 className="app__title">`.

**Detalles técnicos:** Reemplazar `Construí tu idea` por `Construye tu idea`. Cambio de texto puro, sin tocar la clase ni la estructura del elemento.

**De qué parte del spec sale:** `Comportamiento esperado §Título`.

### Tarea 5 — Verificación manual en navegador

**Qué hace:** No es una tarea de código: es correr `/verify-spec` contra esta spec y este plan para confirmar en el navegador real que las tres piezas se ven y se leen como se especificó, antes de dar por cerrado el plan.

**Dónde toca:** N/A (verificación, no implementación).

**Detalles técnicos:** Casos mínimos a cubrir — (1) generar una historia desde construcción libre y confirmar que el resumen se lee como frase conectada; (2) cambiar una pieza manualmente y confirmar que la explicación menciona el efecto sobre el resto en 2 renglones o menos, para cada una de las 4 categorías; (3) usar "🎲 Sorpréndeme" y confirmar lo mismo para las 4 variantes de sorpresa, incluyendo que el `{valor}` se interpola bien; (4) confirmar visualmente el título "Construye tu idea"; (5) confirmar que nada de la construcción libre, los colores por categoría, ni el resaltado de texto en la historia cambiaron de comportamiento.

**De qué parte del spec sale:** Los tres bloques de `Comportamiento esperado` de la spec, en conjunto.
