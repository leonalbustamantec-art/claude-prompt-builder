---
name: verify-spec
description: >-
  Cierra el ciclo de una implementación: cuando Claude considera que ya terminó de implementar el plan de una funcionalidad del sitio de Leo, este skill deja de codear y se enfoca en PROBAR los cambios en el navegador de verdad. Levanta el servidor, elige 5 casos de prueba importantes derivados del spec y del plan, los ejecuta directamente en el navegador, recoge el feedback (qué funcionó y qué no), lo compara contra el spec (docs/specs/) y el plan que se venía siguiendo, y con ese feedback arregla lo que falle o no alcance para cumplir el objetivo — o da luz verde y termina si todo cumple. Usar cuando Claude termine de implementar un plan, o cuando Leo diga "probá lo que hiciste", "verificá que esto cumpla el spec", "corré los casos de prueba en el navegador", "¿esto ya está listo?", "cerrá el ciclo de esta feature", o invoque /verify-spec. NO es la revisión de pre-publicación del sitio completo contra el checklist de 5 puntos (para eso está /revision-final), NO es escribir la spec (para eso está /design-spec), y NO es el brainstorming ni el plan de un feature nuevo (para eso está /brainstorming-code).
---

# Verify Spec

Este skill es el **paso de cierre de una implementación**. Se invoca cuando Claude cree que ya terminó de implementar el plan de una funcionalidad: en ese momento deja de escribir código nuevo y se dedica a **probar que lo construido cumple lo que se especificó**, en el navegador real, no en la teoría.

El ciclo completo del proyecto es: `/brainstorming-code` (qué y por qué) → `/design-spec` (comportamiento esperado) → plan técnico → implementación → **`/verify-spec` (probar y cerrar)**. Este skill ocupa el último eslabón: comprueba contra el spec y el plan lo que se acaba de construir, y solo entonces da luz verde.

La regla que ordena todo, igual que en el resto del proyecto: **probar de verdad, no suponer.** No se declara nada "funcionando" sin haberlo visto funcionar en el navegador. Y **no inventar** resultados: si un caso no se pudo probar, se dice explícitamente (`CLAUDE.md §16`).

## Antes de probar: recuperar spec y plan

No se puede verificar contra un objetivo que no se tiene a la vista. Antes de levantar nada:

1. **Ubicá el spec** de la funcionalidad en `docs/specs/` (el más relacionado con lo que se implementó). Leelo, en particular las secciones **Alcance v1**, **Comportamiento esperado** y **Posibles errores y mitigaciones** — de ahí salen los casos de prueba.
2. **Recuperá el plan** en `docs/plans/` (el que emparejó con esa spec — suele compartir el mismo slug), y en su defecto el plan que se venía siguiendo en esta conversación. Fijate sobre todo en la **Lista de tareas a implementar**: es lo que se dijo que se iba a construir. Si no hay spec ni plan claros, avisá a Leo antes de seguir: sin una referencia contra qué comparar, esto sería adivinar.

Si el spec y el plan están claros, no vuelvas a preguntar: pasá a probar.

## Cómo probar

Preferí **siempre** el navegador real por encima de leer el código a ciegas.

1. **Levantá el servidor de dev** (usá las herramientas de preview del proyecto; nunca un servidor por Bash) y abrí el sitio.
2. Chequeá que arranca sin errores: revisá la consola y los logs del server antes de empezar.
3. Ejecutá cada caso de prueba **interactuando de verdad** — clickeando, escribiendo en los campos, navegando — y observá el resultado con las herramientas de preview (leer la página, consola, red, screenshot). No confíes solo en una captura para dar por bueno un comportamiento.

## Elegir los 5 casos de prueba

Elegí **exactamente 5 casos importantes**, no 20 triviales. La calidad está en cuáles elegís. Derivalos del spec y del plan, cubriendo esta mezcla:

- **El camino feliz principal**: el flujo central de "Comportamiento esperado" del spec, de punta a punta. El uso para el que existe la funcionalidad.
- **Uno o dos casos de "Alcance v1"**: que lo que el spec prometió para la v1 efectivamente esté y funcione (ni de menos, ni de más).
- **Uno o dos casos de "Posibles errores y mitigaciones"**: entrada inválida, dato faltante o caso límite, verificando que el usuario ve el mensaje o el comportamiento que el spec definió.
- **Un caso de experiencia/criterio del sitio** cuando aplique: que la interacción sirva para comprender o descubrir y no sea adorno, y que se vea bien (incluido móvil si la funcionalidad lo amerita) — alineado con `CLAUDE.md §4` y §10.

Antes de ejecutarlos, enunciá brevemente los 5 casos y qué resultado esperás de cada uno (según el spec), para que Leo vea contra qué se está probando.

## Recoger feedback y comparar

Para cada caso, registrá el resultado con honestidad:

- **Qué se esperaba** (según el spec/plan) vs. **qué pasó de verdad**.
- Veredicto por caso: **cumple** / **falla** / **queda corto** (funciona pero no alcanza el objetivo o la calidad esperada) / **no se pudo probar** (y por qué).

Comparar es contra dos referencias: el **spec** (el comportamiento y el alcance prometidos) y el **plan** (lo que se dijo que se iba a construir). Si algo se implementó distinto de lo planeado, no es automáticamente un error — pero hay que notarlo y juzgar si el resultado sigue cumpliendo el objetivo del spec.

## Qué hacer con el feedback

Según lo que arroje la comparación:

- **Si todo cumple** → **luz verde.** Cerrá con un resumen claro: los 5 casos probados, su resultado, y la afirmación de que la implementación cumple el spec y el plan. Termina acá.
- **Si algo falla o queda corto** → **arreglalo.** Este skill sí corrige (a diferencia de `/revision-final`): diagnosticá la causa en el código, hacé el arreglo, y **volvé a probar ese caso** para confirmar que quedó resuelto. Repetí hasta que los 5 cumplan o hasta toparte con un límite real.

Límites del arreglo (importante, para no desbordar el alcance):

- Arreglá solo lo que hace falta para que **lo implementado cumpla el spec y el plan** de esta funcionalidad. No aproveches para agregar features nuevas, refactors grandes ni cosas fuera del alcance v1.
- Si un caso falla por algo que **contradice el spec o excede lo planeado** —el spec estaba incompleto, o el arreglo implica una decisión de producto o de arquitectura nueva—, no decidas por tu cuenta: **pará y preguntá a Leo.** Ahí puede corresponder volver a `/design-spec` o `/guardian-arquitectura`, no seguir codeando.
- Explicá cada arreglo en lenguaje claro (Leo está aprendiendo y revisa, `CLAUDE.md §16`).

## Qué entregar SIEMPRE

Un reporte de verificación con:

1. Los **5 casos** probados, con su veredicto (cumple / falla / queda corto / no se pudo probar).
2. Los **arreglos** hechos, si los hubo, con el porqué de cada uno y la confirmación de que se volvió a probar.
3. El **veredicto final**: **luz verde** (cumple el spec y el plan) o **pendiente** (qué queda por resolver o por decidir con Leo).

Si algún caso no se pudo probar, decilo explícitamente — nunca lo omitas en silencio ni lo des por bueno.

## Revisión editorial final (antes de entregar)

El reporte y cualquier texto que toque el repo van en la voz del proyecto (`CLAUDE.md §8`):

- [ ] **Español neutro**, sin voseo.
- [ ] **Ortografía y gramática.**
- [ ] **Una sola voz**, consistente con el resto del proyecto.
- [ ] **Nada inventado**: cada veredicto se sostiene en algo que se probó de verdad.

## Reglas innegociables

- **Probar de verdad en el navegador**, no suponer. Nada se declara funcionando sin haberlo visto funcionar.
- **Exactamente 5 casos importantes**, derivados del spec y del plan — no una lista larga de casos triviales.
- **No inventar resultados.** Lo que no se pudo probar se dice.
- **Arreglar solo dentro del alcance** del spec y el plan. Ante una decisión de producto o arquitectura nueva, parar y preguntar a Leo.
- **Respetar la voz** (`CLAUDE.md §8`): español neutro, sin marketing vacío.
