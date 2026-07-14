# Refinamiento de copy: resumen de la idea, explicación de cambios y título

## 1. Overview

Esta especificación refina tres piezas de copy y presentación de la funcionalidad "Nuevas interacciones del MVP" (`docs/specs/2026-07-13-nuevas-interacciones-mvp.md`), ya construida. No agrega funcionalidad nueva ni cambia el flujo de uso: ajusta cómo se comunican los mismos estados para reforzar mejor el objetivo pedagógico del producto (`CLAUDE.md §4`): que el niño entienda que una idea se arma combinando piezas conectadas entre sí, y que cambiar una sola pieza transforma el resultado completo.

Los tres ajustes son:

1. El resumen "Así construiste tu idea" deja de leerse como una lista de etiquetas sueltas y pasa a leerse como la idea contada de principio a fin.
2. El texto que explica un cambio de pieza pasa a explicar también el efecto de ese cambio sobre el resto de la historia, no solo qué categoría cambió.
3. El título de la aplicación se corrige de voseo a español neutro.

## 2. Usuario objetivo

Niños entre 9 y 12 años (`CLAUDE.md §3`), el mismo público que el resto del MVP. Ninguno de los tres ajustes debe requerir explicación previa ni introducir lenguaje técnico; deben ser más fáciles de entender que la versión actual, no solo distintos.

## 3. Contexto del problema

* **Resumen de piezas:** hoy se muestran cuatro tarjetas sueltas (por ejemplo "Un robot" · "cocina" · "en el espacio" · "de forma divertida") sin ninguna palabra que las conecte. Un niño las lee como cuatro datos separados, no como una idea única armada por partes — que es exactamente lo que el producto busca enseñar (`CLAUDE.md §4`: "los niños no construyen prompts, construyen ideas").
* **Explicación al cambiar una pieza:** el texto actual solo nombra qué categoría cambió (por ejemplo "Cambiaste el personaje. Ahora alguien diferente protagoniza tu idea."), pero no dice qué pasa con el resto de la historia. Esto no refuerza la lección central de la dinámica "Cambia una pieza" (`docs/gameplay.md §6`): que las piezas están conectadas y modificar una sola repercute en el conjunto.
* **Título en voseo:** el título actual, "Construí tu idea", usa la forma imperativa del voseo argentino. El resto del proyecto y su documentación usan español neutro; el título queda inconsistente con esa voz.

## 4. Alcance v1

**Incluido:**

* Reescritura del resumen "Así construiste tu idea" para que se lea como una idea conectada (quién → qué hace → dónde → cómo), manteniendo los mismos elementos visuales que ya existen: cada pieza sigue siendo una tarjeta con su emoji, su texto y el color de su categoría (`docs/ui.md §Categorías y colores`). Lo que cambia es cómo se presentan en conjunto, no el sistema visual de cada pieza.
* El resaltado temporal de la pieza recién cambiada (ya existente) se mantiene igual, aplicado sobre la misma tarjeta dentro de la nueva presentación.
* Nuevo texto para las 8 variantes de explicación al cambiar una pieza (4 categorías × cambio manual / pieza sorpresa), de no más de 2 renglones, que mencione qué cambió **y** qué efecto tiene ese cambio sobre el resto de la historia.
* Corrección del título de "Construí tu idea" (voseo) a "Construye tu idea" (español neutro).
* Revisión del resto de los textos visibles de la app en busca de voseo adicional. Se revisaron los textos actuales (botones, preguntas, mensajes de carga y error) y no se encontró otro caso — solo el título.

**Fuera de alcance v1:**

* Cambios a la lógica de generación de historias, al estado de la aplicación, o a los datos de las piezas (`BLOCKS`).
* Cambios a los colores por categoría o al mecanismo de resaltado de texto en la historia generada (`docs/ui.md §Categorías y colores`), ambos ya definidos y funcionando.
* Rediseño visual de las tarjetas/chips (tamaño, forma, disposición en pantalla) más allá de lo necesario para que se lean como una idea conectada.
* Cambios al texto de vista previa de la construcción libre (`app__preview`, arriba del botón "Generar historia"), que no fue señalado como problema.

## 5. Comportamiento esperado

### Resumen "Así construiste tu idea"

* Se sigue mostrando en el mismo lugar y en los mismos momentos que hoy: después de cualquier historia generada, ya sea desde la construcción libre, durante una comparación en curso, o como historia base confirmada tras un cambio.
* En lugar de una fila de tarjetas sueltas, el resumen se lee como una oración: primero quién, después qué hace, después dónde, y por último cómo lo hace — el mismo orden en el que ya se arma la historia en el resto de la app. Cada pieza sigue mostrándose con su tarjeta visual actual (emoji + texto + color de categoría), pero ahora hay palabras breves entre tarjeta y tarjeta que arman la frase a su alrededor, de modo que el conjunto se lee de corrido, como una idea, no como una lista.
* Ejemplo del resultado esperado, con las piezas de ejemplo usadas en esta spec: algo con la forma "🤖 Un robot que 🍳 cocina 🚀 en el espacio, 😄 de forma divertida" — cada tramo en negrita/tarjeta corresponde a una pieza, y las palabras entre ellas ("que", "en", "de forma") solo existen para que la frase se lea natural.
* Mientras hay una comparación activa, la pieza que cambió se resalta igual que hoy (borde y color de su categoría), ahora dentro de esta presentación narrativa.
* Al confirmar un cambio como nueva base, el resumen se actualiza con el nuevo valor y mantiene el resalte breve antes de volver al estado normal — mismo comportamiento que existe hoy.

### Explicación al cambiar una pieza

El texto que acompaña la comparación Antes/Después pasa de una sola frase a un texto de hasta 2 renglones que dice dos cosas: qué pieza cambió, y qué efecto tiene ese cambio sobre el resto de la historia — no solo nombrar la categoría modificada.

Se mantienen las 8 variantes actuales (4 categorías, cada una con su versión de cambio manual y su versión de pieza sorpresa), con el mismo criterio de hoy: la versión manual no repite el valor elegido (el niño ya lo ve en pantalla), la versión de sorpresa sí lo nombra.

**Cambio manual** (el niño elige la opción):

* Personaje: `Cambiaste el personaje. Con otro protagonista, toda la historia se siente distinta.`
* Acción: `Cambiaste la acción. Con algo distinto ocurriendo, la historia cambia de ritmo.`
* Lugar: `Cambiaste el lugar. En otro escenario, la misma historia se ve completamente distinta.`
* Estilo: `Cambiaste el estilo. Con otro ánimo, la misma historia se siente como una idea nueva.`

**Pieza sorpresa** (la app elige y nombra el valor nuevo, reemplazando `{valor}`):

* Personaje: `Cambiamos el personaje. Ahora es {valor}, y toda la historia se lee distinta a su alrededor.`
* Acción: `Cambiamos la acción. Ahora {valor}, y eso le da otro ritmo a toda la historia.`
* Lugar: `Cambiamos el lugar. Ahora la historia sucede {valor}, y se siente completamente distinta.`
* Estilo: `Cambiamos el estilo. Ahora es {valor}, y la misma idea se siente como otra historia.`

El límite de 2 renglones se verifica tomando **el escritorio como referencia** (el layout con el panel de bloques a la izquierda y el resultado a la derecha, `docs/ui.md §Estructura`), probando con el valor más largo de cada categoría. En pantallas muy angostas (celular) el texto puede ocupar más de 2 renglones — se acepta, porque acortar el copy lo suficiente para garantizar 2 renglones también en celular lo dejaba con muy poco contenido ("todo cambia" repetido en las cuatro categorías), perdiendo el objetivo de que sea más explicativo.

### Título

* El título de la aplicación cambia de "Construí tu idea" a "Construye tu idea". Es el único texto de la interfaz actual identificado en voseo; el resto de los textos visibles ya usan formas neutras (por ejemplo "¿Qué crees que pasará si cambias solo una pieza?").

## 6. Posibles errores y mitigaciones

* **El nuevo copy de la explicación no entra en 2 renglones en pantallas angostas (celular):** se verifica visualmente durante la implementación y, si no entra, se ajusta la redacción sin perder ninguna de las dos ideas (qué cambió + efecto sobre el resto), tal como se indica arriba.
* **La nueva presentación narrativa del resumen se vuelve difícil de leer si las palabras conectoras compiten visualmente con las tarjetas:** las palabras conectoras deben verse claramente como texto secundario (más chicas o de menor peso que las tarjetas), para que las piezas —lo que el niño realmente eligió— sigan siendo lo más visible, igual que hoy.
* Ninguno de los tres ajustes introduce nuevos estados de carga, error de red, o casos límite: la lógica de generación, carga y manejo de errores existente (`docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Posibles errores y mitigaciones`) no se modifica.
