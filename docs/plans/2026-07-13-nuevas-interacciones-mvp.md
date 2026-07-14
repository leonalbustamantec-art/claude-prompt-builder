# Nuevas interacciones del MVP — Plan de implementación

## 1. Objetivo

Ampliar la app React + Vite existente con "Cambia una pieza", "Pieza sorpresa" y "Así construiste tu idea", sin modificar la lógica ni el diseño visual de la construcción libre actual. Cuando el plan esté ejecutado, después de generar una historia el niño podrá cambiar una sola pieza (manual o al azar), ver la comparación Antes/Después con una explicación, y ver siempre un resumen de las piezas usadas.

## 2. Contexto del problema

`docs/gameplay.md §5-6` define el ciclo "Descubrir → Experimentar", pero hoy la app no ofrece una forma de experimentar cambiando una sola pieza: solo existe reiniciar todo o generar de nuevo desde cero. Esta funcionalidad hace tangible el aprendizaje central del producto (`CLAUDE.md`): una idea se construye combinando piezas, y cambiar una sola pieza transforma el resultado.

## 3. Spec de referencia

| Documento | Alcance |
|-----------|---------|
| `docs/specs/2026-07-13-nuevas-interacciones-mvp.md` | Spec de esta funcionalidad — comportamiento esperado de las tres dinámicas nuevas |
| `docs/specs/2026-07-13-vision-filosofia-mvp.md` | Spec principal — visión, filosofía y principios |
| `docs/gameplay.md` | Ciclo del juego (Explorar → Construir → Descubrir → Experimentar → Repetir) |
| `docs/interaction.md` | Reglas de interacción: inmediatez, reversibilidad, manejo de errores |
| `docs/ui.md` | Dirección visual y restricciones |
| `docs/plans/2026-07-13-mvp-bloques-interactivos.md` | Plan previo — código base sobre el que se construye este plan |

El plan parte del Alcance v1 de `docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Alcance v1`: sin historial de cambios encadenados, sin compartir, sin cambiar más de una categoría a la vez, sin tocar la construcción libre existente.

## 4. Lista de tareas a implementar

### Tarea 1 — Datos de apoyo: explicaciones de cambio y selección aleatoria

**Qué hace:** Crea los datos y la lógica pura que usarán los componentes nuevos: los textos de explicación por categoría y la función que elige una categoría y una opción al azar.

**Dónde toca:**
- `src/data/changeExplanations.js` (archivo nuevo)
- `src/lib/pickRandomChange.js` (archivo nuevo)

**Detalles técnicos:**
- `changeExplanations.js` exporta un objeto indexado por `block.id` con el texto exacto de la spec:
  ```js
  export const CHANGE_EXPLANATIONS = {
    personaje: 'Cambiaste el personaje. Ahora alguien diferente protagoniza tu idea.',
    accion: 'Cambiaste la acción. Ahora ocurre algo distinto.',
    lugar: 'Cambiaste el lugar. La idea ahora ocurre en otro mundo.',
    estilo: 'Cambiaste el estilo. La misma idea ahora se siente diferente.',
  }
  ```
- El mismo archivo exporta `SURPRISE_EXPLANATIONS`, un objeto indexado por `block.id` de funciones `(valor) => texto`, con la plantilla por categoría de `Comportamiento esperado §Pieza sorpresa`:
  ```js
  export const SURPRISE_EXPLANATIONS = {
    personaje: (valor) => `Cambiamos el personaje. Ahora es ${valor}.`,
    accion: (valor) => `Cambiamos la acción. Ahora ${valor}.`,
    lugar: (valor) => `Cambiamos el lugar. Ahora la historia sucede ${valor}.`,
    estilo: (valor) => `Cambiamos el estilo. Ahora es ${valor}.`,
  }
  ```
  Los textos de `personaje` (`Un mago`, `Un robot`...) están en mayúscula porque también se usan como inicio de oración en la vista previa de construcción libre; al insertarlos a mitad de frase aquí, se pasa `valor` con la primera letra en minúscula.
- `pickRandomChange(selectedIndices)` recibe el array de índices activos y devuelve `{ categoryIndex, optionIndex }`: elige `categoryIndex` al azar entre 0 y 3, y `optionIndex` al azar entre las opciones de `BLOCKS[categoryIndex]` **excluyendo** `selectedIndices[categoryIndex]` (usa `BLOCKS` de `src/data/blocks.js`)
- Es lógica pura, sin estado ni efectos — facilita mantenerla separada de la UI, igual que `generateStory.js`

**De qué parte del spec sale:** `Comportamiento esperado §Cambia una pieza` (textos exactos) y `§Pieza sorpresa` (excluir la opción activa) y `§Posibles errores y mitigaciones` (garantizar que la historia sí cambie).

---

### Tarea 2 — Reestructurar el estado de historia en `App.jsx`

**Qué hace:** Reemplaza el estado plano actual (`story`, `error`) por un modelo de historia base + comparación, que soporta tanto la construcción libre como los cambios de pieza.

**Dónde toca:** `src/App.jsx`

**Detalles técnicos:**
- Nuevo estado:
  - `baseline` — `{ indices, story } | null`: la historia confirmada actual
  - `comparison` — `{ indices, categoryIndex, story } | null`: el resultado de probar un cambio, pendiente de confirmar
  - `loading`, `error` se mantienen como hoy, pero ahora cubren tanto la generación desde construcción libre como la generación de una comparación
- `handleGenerate` (ya existente): en éxito, hace `setBaseline({ indices: selectedIndices, story: generatedStory })` y `setComparison(null)`, en vez de `setStory`
- `handleReset` (ya existente): además de reiniciar `selectedIndices`, limpia `baseline` y `comparison`
- Nuevo `handleTryChange(categoryIndex, optionIndex)`:
  1. Construye `newIndices` a partir de `baseline.indices`, reemplazando solo `categoryIndex`
  2. `setLoading(true)`, `setError(null)`
  3. Llama a `generateStory(...)` con los textos derivados de `newIndices`
  4. En éxito: `setComparison({ indices: newIndices, categoryIndex, story: generatedStory })`
  5. En error: `setError('¡Ups! Algo salió mal. Intenta de nuevo.')`, sin tocar `baseline` ni `comparison`
  6. `setLoading(false)` en `finally`
- Nuevo `handleSurprise()`: usa `pickRandomChange(baseline.indices)` (Tarea 1) y llama a `handleTryChange` con el resultado
- Nuevo `handleDiscardComparison()`: `setComparison(null)` (vuelve al selector de categorías, la base no cambia)
- Nuevo `handleKeepComparison()`: `setBaseline(comparison)`, `setSelectedIndices(comparison.indices)`, `setComparison(null)` (los bloques de construcción libre quedan sincronizados con la nueva base)
- El `previewText` de construcción libre (Tarea 6 del plan anterior) sigue derivándose de `selectedIndices` sin cambios

**De qué parte del spec sale:** `Comportamiento esperado §Estado base y comparación`, `§Acciones sobre la comparación`. `Posibles errores y mitigaciones` — la generación fallida no debe perder la historia base.

---

### Tarea 3 — Componente `StorySummary` ("Así construiste tu idea")

**Qué hace:** Muestra las cuatro piezas de la historia activa como chips, resaltando temporalmente la que cambió cuando hay una comparación en curso.

**Dónde toca:**
- `src/components/StorySummary.jsx` (componente nuevo)
- `src/components/StorySummary.css` (estilos nuevos)

**Detalles técnicos:**
- Props: `indices` (array de 4 índices a mostrar — `baseline.indices`, o `comparison.indices` mientras hay comparación activa), `highlightedCategoryIndex` (número | `null`)
- Renderiza un chip por bloque de `BLOCKS`, usando `block.label`, `block.options[indices[i]].emoji` y `.text`
- El chip en `highlightedCategoryIndex` recibe una clase `story-summary__chip--highlighted` con un color de acento (usa `var(--block-color)` de la categoría, igual criterio que `Block.css`) y una transición CSS breve, consistente con `docs/ui.md §Interacción visual` (solo animaciones CSS simples)
- Componente stateless, sin lógica propia

**De qué parte del spec sale:** `Comportamiento esperado §Así construiste tu idea`.

---

### Tarea 4 — Componente `CategoryPicker` ("Cambia una pieza")

**Qué hace:** Muestra la pregunta "¿Qué crees que pasará si cambias solo una pieza?", el selector de categoría y, al elegir una, las opciones disponibles de esa categoría (excluyendo la activa).

**Dónde toca:**
- `src/components/CategoryPicker.jsx` (componente nuevo)
- `src/components/CategoryPicker.css` (estilos nuevos)

**Detalles técnicos:**
- Props: `baselineIndices` (array de 4), `loading` (boolean), `onSelectOption(categoryIndex, optionIndex)`
- Estado local `activeCategoryIndex` (número | `null`) — qué categoría está expandida mostrando sus opciones; vive en este componente porque es un detalle de presentación, no de la historia
- Paso 1: cuatro botones (uno por `BLOCKS[i].label`), al hacer clic setea `activeCategoryIndex`
- Paso 2: cuando `activeCategoryIndex !== null`, renderiza las opciones de `BLOCKS[activeCategoryIndex].options` como chips (emoji + texto), excluyendo el índice en `baselineIndices[activeCategoryIndex]`; al hacer clic en una opción llama `onSelectOption(activeCategoryIndex, optionIndex)`
- Los botones y chips se deshabilitan mientras `loading === true`, con el mismo criterio que el botón "Generar historia" (`app__generate:disabled`)
- Reutiliza el patrón visual de chip/opción ya usado en `Block.jsx` (emoji grande + texto) para mantener consistencia, sin duplicar el propio componente `Block`

**De qué parte del spec sale:** `Comportamiento esperado §Cambia una pieza (flujo manual)`, pasos 1-3.

---

### Tarea 5 — Componente `ComparisonCard` (Antes / Después)

**Qué hace:** Muestra la comparación entre la historia base y la historia con el cambio de pieza, la explicación correspondiente, y las tres acciones disponibles.

**Dónde toca:**
- `src/components/ComparisonCard.jsx` (componente nuevo)
- `src/components/ComparisonCard.css` (estilos nuevos)

**Detalles técnicos:**
- Props: `beforeStory` (string), `afterStory` (string), `categoryIndex` (número), `changedValueText` (string — el texto de la nueva opción elegida), `isSurprise` (boolean), `onChangeAnother`, `onRestart`, `onKeepAsBase`
- Estructura: sección "Antes" con `beforeStory`, sección "Después" con `afterStory` (mismo tratamiento de texto que la tarjeta de resultado actual: `white-space: pre-wrap`)
- Texto de explicación:
  - Si `isSurprise` es `false`: usa `CHANGE_EXPLANATIONS[BLOCKS[categoryIndex].id]` (Tarea 1), texto fijo
  - Si `isSurprise` es `true`: arma el texto dinámico `Cambiamos ${BLOCKS[categoryIndex].label en minúsculas correspondiente}. Tu historia ahora tiene ${changedValueText}.` — como la spec da un solo ejemplo concreto (`Cambiamos el lugar. Tu historia ahora sucede en la Luna.`) y no una plantilla por categoría, se arma con el nombre de la categoría en lugar de una frase distinta por cada una, para no inventar copy que la spec no definió (**dejar como `TODO: revisar copy exacto de "Sorpréndeme" con Leo/usuario antes de pulir el texto final**)
- Tres botones de acción, con el texto literal de la spec: "Cambiar otra pieza", "Volver a la construcción libre", "Continuar usando la nueva historia como base" — llaman a `onChangeAnother`, `onRestart`, `onKeepAsBase` respectivamente
- Se destaca visualmente cuál fue la categoría modificada (por ejemplo, una etiqueta con el color de esa categoría sobre la sección "Después"), coherente con `docs/specs/2026-07-13-nuevas-interacciones-mvp.md`: "La interfaz debe destacar visualmente cuál fue la pieza modificada"

**De qué parte del spec sale:** `Comportamiento esperado §Cambia una pieza` paso 4-5, `§Pieza sorpresa` paso 4, `§Acciones sobre la comparación`.

---

### Tarea 6 — Botón "🎲 Sorpréndeme" e integración en `App.jsx`

**Qué hace:** Agrega el botón de pieza sorpresa junto al `CategoryPicker`, conectado a `handleSurprise` (Tarea 2).

**Dónde toca:** `src/App.jsx`, `src/App.css`

**Detalles técnicos:**
- El botón solo se muestra cuando existe `baseline` y no hay `comparison` activa (mismas condiciones que `CategoryPicker`)
- Texto: `🎲 Sorpréndeme`; se deshabilita mientras `loading === true`, igual criterio que el botón "Generar historia"
- Ubicado visualmente junto a la pregunta de "Cambia una pieza", no compite con el botón principal de construcción libre

**De qué parte del spec sale:** `Comportamiento esperado §Pieza sorpresa` paso 1.

---

### Tarea 7 — Composición final en `App.jsx`

**Qué hace:** Conecta todos los componentes y estados nuevos en el render principal, respetando el layout de una sola pantalla.

**Dónde toca:** `src/App.jsx`, `src/App.css`

**Detalles técnicos:**
- Orden de renderizado dentro de `app__panel`, después de la tarjeta de resultado existente:
  1. `StorySummary` — con `indices = comparison ? comparison.indices : baseline?.indices`, `highlightedCategoryIndex = comparison?.categoryIndex ?? null` — solo si `baseline` existe
  2. Si `comparison === null`: `CategoryPicker` + botón "Sorpréndeme" (Tarea 4 y 6) — solo si `baseline` existe
  3. Si `comparison !== null`: `ComparisonCard` (Tarea 5) en vez del `CategoryPicker`
- El mensaje de error (`error`) se sigue mostrando igual que hoy, debajo del botón que corresponda, sin bloquear los bloques de construcción libre (`docs/interaction.md §7`)
- Los bloques de construcción libre (`app__blocks`) permanecen siempre visibles y editables, sin cambios respecto al comportamiento actual
- Verificar que el layout responsive existente (`app__layout` en columna en móvil, en fila desde 768px) siga funcionando con las secciones nuevas — no se agregan breakpoints nuevos, se reutilizan los de `App.css`

**De qué parte del spec sale:** `Alcance v1` — no modificar la lógica ni el diseño visual de la construcción libre existente; `docs/ui.md §Estructura` — una sola pantalla.

---

### Tarea 8 — Estilos de resaltado y transición

**Qué hace:** Agrega los estilos compartidos de resaltado (chip modificado en `StorySummary`, etiqueta de "pieza modificada" en `ComparisonCard`) siguiendo la paleta y las restricciones visuales existentes.

**Dónde toca:** `src/components/StorySummary.css`, `src/components/ComparisonCard.css`

**Detalles técnicos:**
- Reutiliza los colores por categoría ya definidos en `Block.css` (`--block-color` por `block.id`) para el resaltado, en vez de definir una paleta nueva
- Transición de resaltado: opacidad o escala breve (`transition: 0.15s-0.2s ease`), igual criterio que las transiciones ya usadas en `Block.css` y `App.css` — sin animaciones avanzadas ni librerías (`docs/ui.md §Restricciones`)
- No se agrega ninguna dependencia nueva de animación

**De qué parte del spec sale:** `docs/ui.md §Interacción visual`, `§Restricciones`.

---

### Tarea 9 — Prompt con etiquetas por categoría

**Qué hace:** Actualiza la plantilla del prompt para que la IA envuelva la primera mención de cada elemento con una etiqueta identificable, habilitando el resaltado por color.

**Dónde toca:** `src/lib/generateStory.js`

**Detalles técnicos:**
- Actualiza `buildPrompt` con la plantilla ya documentada en `docs/blocks.md §4`: agrega la instrucción de envolver la primera mención de cada elemento con `<personaje>`, `<accion>`, `<lugar>`, `<estilo>` (una sola vez cada una, sin anidar, sin otras etiquetas ni markdown)
- `generateStory` no cambia su firma ni su forma de llamar a `/api/generate`: sigue devolviendo el string crudo de `data.story`, ahora con esas etiquetas incluidas — el parseo ocurre en el cliente (Tarea 10)

**De qué parte del spec sale:** `docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Resaltado de piezas en la historia`.

---

### Tarea 10 — Parseo del texto resaltado

**Qué hace:** Crea la lógica pura que convierte el string con etiquetas en segmentos para renderizar, y la que devuelve el texto plano para copiar.

**Dónde toca:** `src/lib/parseHighlightedStory.js` (archivo nuevo)

**Detalles técnicos:**
- `parseHighlightedStory(rawStory)` devuelve un array de segmentos `{ text, categoryId }`, con `categoryId` en `'personaje' | 'accion' | 'lugar' | 'estilo' | null` (`null` para el texto fuera de cualquier etiqueta)
- Usa una expresión regular simple sobre las cuatro etiquetas conocidas (`/<(personaje|accion|lugar|estilo)>([\s\S]*?)<\/\1>/g`) para partir el string en segmentos, en orden
- Si `rawStory` no trae ninguna etiqueta (la IA no las incluyó), devuelve un único segmento `{ text: rawStory, categoryId: null }` — nunca lanza error, nunca deja etiquetas crudas visibles (`docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Resaltado de piezas en la historia`, mitigación)
- `stripHighlightTags(rawStory)` devuelve el string sin las cuatro etiquetas (conserva el texto interior), para usarlo en "Copiar idea"
- Es lógica pura, sin estado ni efectos, testeable igual que `pickRandomChange.js`

**De qué parte del spec sale:** `docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Resaltado de piezas en la historia`.

---

### Tarea 11 — Componente `HighlightedStory`

**Qué hace:** Renderiza el texto de una historia con cada pieza resaltada en el color de su categoría.

**Dónde toca:**
- `src/components/HighlightedStory.jsx` (componente nuevo)
- `src/components/HighlightedStory.css` (estilos nuevos)

**Detalles técnicos:**
- Props: `text` (string crudo, con o sin etiquetas)
- Usa `parseHighlightedStory` (Tarea 10) para obtener los segmentos y renderiza cada uno: texto plano tal cual, o envuelto en `<mark className={`highlighted-story__mark highlighted-story__mark--${categoryId}`}>` cuando tiene `categoryId`
- Mantiene `white-space: pre-wrap` en el contenedor, igual que el tratamiento actual de `app__story` (no se pierde el formato de párrafos)
- Estilos: fondo suave por categoría (no el color sólido) + texto en un tono legible sobre ese fondo, reutilizando `--block-color` por categoría (mismo criterio que `Block.css`, `StorySummary.css`); tamaño de fuente heredado del contenedor para no romper la tipografía ya definida en `docs/ui.md §Tipografía`
- Componente stateless, sin lógica propia

**De qué parte del spec sale:** `docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Resaltado de piezas en la historia`.

---

### Tarea 12 — Integrar `HighlightedStory` en `App.jsx`

**Qué hace:** Reemplaza el texto plano de la historia de construcción libre por el componente resaltado, y ajusta "Copiar idea" para copiar siempre texto plano.

**Dónde toca:** `src/App.jsx`

**Detalles técnicos:**
- Reemplaza `<p className="app__story">{story}</p>` por `<HighlightedStory text={baseline.story} />`
- `handleCopy` usa `stripHighlightTags(baseline.story)` (Tarea 10) en vez del string crudo, para que lo copiado no incluya etiquetas

**De qué parte del spec sale:** `docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Resaltado de piezas en la historia` (último punto: "Copiar idea" copia siempre texto plano).

---

### Tarea 13 — Integrar `HighlightedStory` en `ComparisonCard`

**Qué hace:** Aplica el mismo resaltado a las secciones "Antes" y "Después" de la comparación.

**Dónde toca:** `src/components/ComparisonCard.jsx`

**Detalles técnicos:**
- Reemplaza el render de `beforeStory` y `afterStory` por `<HighlightedStory text={beforeStory} />` y `<HighlightedStory text={afterStory} />` respectivamente

**De qué parte del spec sale:** `docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Resaltado de piezas en la historia`.
