---
name: design-spec
description: >-
  Escribe la especificación de una funcionalidad, sección o herramienta del sitio de Leo desde el punto de vista del usuario —qué experimenta y cómo se comporta, no cómo se implementa—, y la deja guardada en docs/specs/YYYY-MM-DD-title.md. Se usa DESPUÉS de tener claridad sobre el problema y sobre qué se quiere hacer (por ejemplo, cuando ya se eligió un approach en /brainstorming-code): es el puente entre esa claridad y el plan técnico. El documento final tiene seis secciones fijas: Overview, Usuario objetivo, Contexto del problema, Alcance v1, Comportamiento esperado, y Posibles errores y mitigaciones. Usar cuando Leo diga "armemos la spec", "documentá esto como especificación", "escribí el design spec de X", "necesito una spec de esta herramienta/sección", "dejemos esto especificado antes de codear", o invoque /design-spec. NO es el brainstorming de un feature todavía sin forma (para eso está /brainstorming-code), NO es el plan de implementación ni el código (la spec describe el qué y el comportamiento, no el cómo técnico), y NO es la revisión del sitio ya construido (para eso está /revision-final).
---

# Design Spec

Este skill produce **un documento de especificación desde el punto de vista del usuario**: describe qué va a experimentar quien use la funcionalidad y cómo se tiene que comportar, **no cómo se construye por dentro**. Es el paso que ordena el problema por escrito antes de que exista un plan técnico o una línea de código.

Se usa **cuando ya hay claridad** sobre el problema y sobre qué se quiere hacer. Si el feature todavía es difuso —no está claro el objetivo, ni el alcance, ni por qué se hace—, ese trabajo va antes en `/brainstorming-code`. Este skill parte de esa claridad y la deja documentada.

La regla que ordena todo, igual que en el resto del proyecto: **no inventar.** Ni requisitos, ni contenido, ni datos, ni comportamiento, ni casos. Si algo necesario para la spec no está definido, no se rellena con algo plausible: se deja un marcador `TODO: pendiente de Leo` en ese punto y se pregunta. (Regla dura de `CLAUDE.md §6` y §16.)

## El principio central: óptica del usuario, no de implementación

La spec responde **qué** y **para quién**, no **cómo técnico**. Describe la funcionalidad como la vive quien la usa —qué ve, qué hace, qué obtiene, qué pasa cuando algo sale mal—, en un lenguaje que entendería tanto un perfil de negocio como uno técnico (la audiencia del sitio es mixta, `CLAUDE.md §3`).

Concretamente, en la spec **sí** entran: el problema del usuario, qué logra, el flujo de uso, los estados visibles, las validaciones desde la experiencia, los mensajes de error que ve. **No** entran: framework, nombres de componentes o archivos, estructura de datos interna, decisiones de librerías, rutas de código. Todo eso es del plan de implementación, que viene después. Si aparece la tentación de escribir "usar un `useState`" o "componente `UtmForm`", esa frase pertenece al plan, no a la spec.

## Antes de escribir: confirmar que hay claridad

No arranques el documento con huecos grandes. Con lo que ya se conversó (o con lo que dejó `/brainstorming-code`), verificá que están claros al menos:

- **Qué se quiere hacer**, en una frase.
- **A qué objetivo del sitio sirve** (`CLAUDE.md §2`: credibilidad, mostrar la forma de pensar, generar oportunidades, ser el centro de la marca).
- **Quién es el usuario** de esta funcionalidad y qué problema suyo resuelve.
- **El alcance v1**: qué entra en la primera versión y qué queda para después.

Si alguno de estos cuatro está en blanco, preguntá antes de escribir —una o dos preguntas puntuales, no un cuestionario—. Especificar sobre un objetivo poco claro produce una spec que hay que rehacer. Si Leo ya dio todo el contexto, no lo vuelvas a pedir: reflejá lo que entendiste y pasá a redactar.

## El documento

**Ubicación y nombre:** `docs/specs/YYYY-MM-DD-title.md`.

- `YYYY-MM-DD` es la fecha de hoy (por ejemplo, `2026-07-12`).
- `title` es un slug corto en minúsculas y con guiones, español neutro, descriptivo del feature (por ejemplo, `generador-utm`, `calculadora-metricas`, `home-hero`).
- Si la carpeta `docs/specs/` no existe todavía, se crea.

**Estructura fija — usar exactamente estas seis secciones, en este orden:**

```markdown
# [Título del feature]

## 1. Overview
## 2. Usuario objetivo
## 3. Contexto del problema
## 4. Alcance v1
## 5. Comportamiento esperado
## 6. Posibles errores y mitigaciones
```

Qué va en cada una:

1. **Overview.** Dos o tres frases: qué es esta funcionalidad, qué permite hacer y a qué objetivo del sitio sirve (`CLAUDE.md §2`). Es el resumen que alguien lee para entender de qué se trata sin leer el resto. Sin detalle técnico.

2. **Usuario objetivo.** Para quién es, dentro de la audiencia del sitio (`CLAUDE.md §3`: empresas con problemas de medición, agencias, líderes de marketing, product owners, reclutadores). No un "usuario" abstracto: cuál de estos perfiles la usa y en qué situación llega a ella. Si sirve a más de uno, nombralos por orden de relevancia.

3. **Contexto del problema.** Qué problema real resuelve y por qué vale la pena resolverlo. Qué hace hoy el usuario sin esto, o qué fricción tiene. Es el "por qué existe" —la justificación—, no la solución todavía.

4. **Alcance v1.** Lo mínimo que la primera versión tiene que hacer para ser útil, en una lista concreta de lo que **entra**. Y —igual de importante— una lista breve de lo que **queda fuera de v1** (lo tentador que puede esperar). El proyecto prioriza la simplicidad del MVP y "preparar, no construir" (`CLAUDE.md §12`, §15); esta sección es donde eso se hace explícito.

5. **Comportamiento esperado.** El corazón de la spec. Cómo se comporta la funcionalidad desde la experiencia del usuario: el flujo de uso paso a paso (qué hace el usuario, qué responde el sistema), los estados visibles (vacío, cargando si aplica, con resultado), y qué obtiene al final. Descrito como una narración de uso, no como pseudocódigo. Si hay interacción, recordá el criterio del sitio: la interacción existe para comprender o descubrir, no de adorno (`CLAUDE.md §4`).

6. **Posibles errores y mitigaciones.** Qué puede salir mal desde la óptica del usuario —entrada inválida, dato faltante, caso límite, acción sin resultado— y cómo lo maneja la funcionalidad para que la experiencia siga siendo clara. Para cada error, el mensaje o comportamiento que ve el usuario. Esto es validación y manejo de casos *vistos desde afuera*, no captura de excepciones en el código.

## Al terminar

- Guardá el archivo en la ruta correcta y confirmale a Leo dónde quedó, con un resumen de una o dos frases de lo que especifica.
- Marcá visiblemente cualquier `TODO: pendiente de Leo` que haya quedado, para que sepa qué falta definir antes de pasar al plan.
- **No arranques el plan técnico ni el código en la misma pasada.** El entregable de este skill es la spec; el "cómo" viene después, y solo cuando Leo apruebe (ver el gate de abajo).

## Approval gate: iterar o aprobar

La spec no está terminada hasta que Leo la aprueba. Una vez guardada, **pará y presentale explícitamente dos caminos**:

- **Iterar** — hay algo que ajustar, falta contexto, un `TODO` por resolver, una sección que no refleja lo que quiere. En ese caso, incorporá el feedback, actualizá el mismo archivo (no crees uno nuevo) y volvé a presentar el gate. Se repite hasta que la spec quede como Leo la quiere.
- **Aprobar y continuar** — la spec está bien y se pasa al plan técnico. Solo con un "sí" claro de Leo (o un pedido directo de avanzar) se invoca **`/plan-spec`**, que toma esta spec aprobada como referencia y produce el plan de implementación en `docs/plans/`.

No asumas la aprobación ni encadenes al plan por tu cuenta: el gate existe para que Leo decida. Si no responde o no aprueba, la spec queda como entregable y ahí termina este skill.

## Revisión editorial final (antes de entregar)

La spec es un entregable del repositorio, así que antes de guardarla verificá (`CLAUDE.md §8`):

- [ ] **Español neutro**, sin voseo (nada de "tenés", "podés", "elegí"; usar "tienes"/"puedes" o formas impersonales).
- [ ] **Ortografía y gramática.**
- [ ] **Una sola voz**, consistente con el resto del proyecto: profesional, cercano, claro, sin marketing vacío.
- [ ] **Nada inventado.** Cada afirmación se sostiene en lo conversado; lo que falta está como `TODO`, no rellenado.
- [ ] **Óptica del usuario**, sin detalle de implementación que corresponda al plan.

## Reglas innegociables

- **No inventar** requisitos, contenido, datos ni comportamiento. Ante la duda, preguntar o dejar `TODO:` explícito.
- **La spec describe el qué y el comportamiento, no el cómo técnico.** El plan y el código son un paso posterior.
- **Las seis secciones son fijas**, en el orden dado. No agregar ni quitar secciones del esqueleto.
- **Respetar la voz** (`CLAUDE.md §8`): español neutro, sin marketing vacío.
