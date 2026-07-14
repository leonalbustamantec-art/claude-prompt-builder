# Nuevas interacciones del MVP — Especificación

## Overview

El MVP actual permite construir una idea combinando cuatro bloques (Personaje, Acción, Lugar, Estilo) y generar una historia. Esta especificación amplía esa experiencia con tres dinámicas nuevas que hacen visible el aprendizaje central del producto: una idea se construye combinando piezas, y cambiar una sola pieza puede transformar todo el resultado.

Las tres dinámicas son:

1. **Cambia una pieza** — después de generar una historia, el niño puede cambiar una sola categoría y comparar el resultado original con el nuevo.
2. **Pieza sorpresa** — un botón que cambia aleatoriamente una sola categoría por el niño.
3. **Así construiste tu idea** — un resumen visual de las piezas usadas en la historia actual, que se actualiza cuando una pieza cambia.

La construcción libre (los cuatro bloques con flechas y el botón "Generar historia") se mantiene como punto de entrada, sin cambios en su lógica ni su diseño visual.

## Usuario objetivo

Niños entre 9 y 12 años (`CLAUDE.md §3`), el mismo público que el MVP actual. Ninguna de las dinámicas nuevas debe requerir explicación previa ni introducir lenguaje técnico.

## Contexto del problema

`docs/gameplay.md §5` ya define que, después de "Descubrir" un resultado, la aplicación debe incentivar la pregunta "¿Qué ocurre si cambio una pieza?". Hoy esa pregunta no tiene una respuesta interactiva: el niño solo puede reiniciar toda la construcción o volver a generar desde cero. El ciclo de "Experimentar" (`docs/gameplay.md §6`) —modificar, observar, comparar, aprender— no está implementado.

Esta especificación cierra ese vacío: convierte el paso de "Experimentar" en una interacción concreta, sin salir de la pantalla única ni romper la construcción libre existente.

## Alcance v1

**Incluido:**

* Sección "Cambia una pieza" visible después de generar una historia (desde construcción libre o desde un cambio anterior confirmado).
* Selección de categoría a cambiar y de una opción distinta dentro de esa categoría.
* Botón "🎲 Sorpréndeme" que cambia una categoría al azar.
* Comparación visual Antes / Después con explicación breve según la categoría modificada.
* Acciones sobre el resultado de la comparación: cambiar otra pieza, volver a la construcción libre, o continuar usando la nueva historia como base.
* Resumen "Así construiste tu idea" con las piezas de la historia activa, visible después de cualquier generación, con la pieza modificada resaltada temporalmente.
* Resaltado por color de cada pieza (personaje, acción, lugar, estilo) dentro del texto de la historia generada, usando los colores de categoría ya definidos (`docs/ui.md §Categorías y colores`).

**Fuera de alcance v1:**

* Historial de todos los cambios realizados (solo se compara la historia base contra el cambio más reciente, no una cadena completa de versiones).
* Compartir o exportar la comparación.
* Cambiar más de una categoría a la vez, con "Sorpréndeme" o manualmente.
* Animaciones avanzadas, sonidos o confeti (`docs/ui.md §Restricciones`).
* Cualquier cambio a la lógica, los datos o el diseño visual de la construcción libre existente, **excepto** el resaltado por color del texto de la historia: como la historia de construcción libre y la de comparación usan la misma función de generación (`generateStory`), el resaltado se aplica a ambas por consistencia visual — no tendría sentido que la misma historia se vea resaltada en un lugar y no en otro.

## Comportamiento esperado

### Estado base y comparación

* La aplicación mantiene una **historia base** (la última confirmada: la generada desde construcción libre, o la aceptada tras un cambio de pieza) y, opcionalmente, una **historia en comparación** (el resultado de probar un cambio de una sola pieza contra la base).
* Mientras no exista una historia en comparación, solo se muestra la historia base y su resumen de piezas.
* Al probar un cambio de pieza (manual o por sorpresa), aparece la comparación Antes (base) / Después (con el cambio), sin descartar la historia base.

### Cambia una pieza (flujo manual)

1. Debajo de la historia generada aparece la pregunta "¿Qué crees que pasará si cambias solo una pieza?" con las cuatro categorías (Personaje, Acción, Lugar, Estilo).
2. El niño elige una categoría. Se muestran las opciones disponibles de esa categoría, excluyendo la que ya está activa en la historia base.
3. Al elegir una opción, la aplicación genera automáticamente la nueva historia (misma mecánica que "Generar historia": estado de carga, manejo de error) manteniendo las otras tres categorías intactas.
4. Se muestra la comparación Antes / Después con la explicación correspondiente a la categoría cambiada:
   * Personaje: `Cambiaste el personaje. Ahora alguien diferente protagoniza tu idea.`
   * Acción: `Cambiaste la acción. Ahora ocurre algo distinto.`
   * Lugar: `Cambiaste el lugar. La idea ahora ocurre en otro mundo.`
   * Estilo: `Cambiaste el estilo. La misma idea ahora se siente diferente.`
5. La pieza modificada se resalta visualmente en el resumen "Así construiste tu idea".

### Pieza sorpresa

1. El botón "🎲 Sorpréndeme" está visible junto a "Cambia una pieza", disponible siempre que exista una historia base.
2. Al presionarlo, la aplicación elige una categoría al azar entre las cuatro, y dentro de ella una opción distinta a la activa en la base.
3. Genera automáticamente la nueva historia y muestra la comparación Antes / Después, igual que en el flujo manual.
4. La explicación nombra la categoría y el valor nuevo concreto, con una plantilla fija por categoría (el texto de la opción elegida reemplaza `{valor}`):
   * Personaje: `Cambiamos el personaje. Ahora es {valor}.` → `Cambiamos el personaje. Ahora es un mago.`
   * Acción: `Cambiamos la acción. Ahora {valor}.` → `Cambiamos la acción. Ahora explora.`
   * Lugar: `Cambiamos el lugar. Ahora la historia sucede {valor}.` → `Cambiamos el lugar. Ahora la historia sucede en la Luna.`
   * Estilo: `Cambiamos el estilo. Ahora es {valor}.` → `Cambiamos el estilo. Ahora es de forma misteriosa.`
5. Nunca cambia más de una categoría por cada uso del botón.

### Acciones sobre la comparación

Cuando la comparación Antes / Después está visible, el niño puede:

* **Cambiar otra pieza** — descarta la comparación actual y vuelve al selector de categorías; la historia base no cambia.
* **Volver a la construcción libre** — reinicia todo: bloques, historia base, comparación y resumen, igual que "Empezar de nuevo" hoy.
* **Continuar usando la nueva historia como base** — la historia en comparación se convierte en la nueva historia base (y los bloques de construcción libre reflejan esa combinación), y la comparación se cierra.

### Así construiste tu idea

* Se muestra después de cualquier historia generada (desde construcción libre o como historia base tras un cambio confirmado).
* Cada pieza (Personaje, Acción, Lugar, Estilo) se representa como una tarjeta o chip con su emoji y texto, en el mismo orden que los bloques.
* Mientras hay una comparación activa, la pieza que cambió se resalta temporalmente para diferenciarla de las otras tres, que permanecen iguales a la base.
* Al confirmar el cambio como nueva base, el resumen se actualiza con el nuevo valor y mantiene el resalte breve antes de volver al estado normal.

### Resaltado de piezas en la historia

* En toda historia mostrada en pantalla (construcción libre, y Antes/Después de una comparación), la parte del texto que corresponde a cada pieza se resalta con el color de su categoría (`docs/ui.md §Categorías y colores`): morado para personaje, naranja para acción, verde para lugar, amarillo para estilo.
* El resaltado se limita a la primera mención de cada elemento — no se resalta cada aparición repetida, para no saturar visualmente el texto.
* El resaltado usa un fondo de color suave (no el color sólido) con el texto en un tono legible sobre ese fondo, consistente con `docs/ui.md §Tipografía` (texto grande, redondeado, fácil de leer para niños de 9 a 12 años).
* Si la historia generada no trae el resaltado esperado (la IA no incluyó alguna etiqueta), se muestra el texto igual, sin esa pieza resaltada — nunca se bloquea ni se muestran etiquetas crudas en pantalla.
* El botón "Copiar idea" copia siempre el texto plano, sin marcas de resaltado.

## Posibles errores y mitigaciones

* **La generación de la historia comparada falla** (error de red o de la API): se conserva la historia base sin cambios, se muestra el mismo mensaje amable ya definido (`¡Ups! Algo salió mal. Intenta de nuevo.`, `docs/interaction.md §7`), y el niño puede volver a intentar sin perder su historia base.
* **"Sorpréndeme" elige la misma opción que ya está activa**: se excluye explícitamente la opción activa al elegir al azar, para garantizar que la historia sí cambie.
* **El niño abandona un cambio a medias** (eligió categoría pero no opción): no hay estado intermedio que perder — la generación ocurre solo cuando elige una opción concreta, así que no queda nada pendiente de confirmar.
* **El niño intenta cambiar una pieza sin haber generado ninguna historia todavía**: la sección "Cambia una pieza" y el botón "Sorpréndeme" no se muestran hasta que exista una historia base, evitando ese estado inválido.
