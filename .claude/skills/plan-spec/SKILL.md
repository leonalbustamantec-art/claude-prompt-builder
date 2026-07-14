---
name: plan-spec
description: >-
  Traduce una spec ya aprobada en un plan de implementación técnico y lo deja guardado en docs/plans/YYYY-MM-DD-title.md. Se usa DESPUÉS de que Leo apruebe el design spec (el approval gate de /design-spec desemboca acá): es el puente entre el "qué y cómo se comporta" (la spec) y el "cómo se construye" (el código). El documento final tiene cuatro secciones fijas: Objetivo, Contexto del problema, Spec de referencia, y Lista de tareas a implementar (con detalles concretos por tarea). Usar cuando Leo apruebe una spec y diga "armemos el plan", "pasá al plan de implementación", "escribí el plan de X", "plan-spec", o invoque /plan-spec. NO es escribir la spec (para eso está /design-spec, que describe el comportamiento desde el usuario), NO es implementar el código todavía (el plan describe las tareas, no las ejecuta), y NO es la verificación de lo construido (para eso está /verify-spec).
---

# Plan Spec

Este skill produce **un plan de implementación técnico** a partir de una spec ya aprobada. Es el paso donde el "qué y cómo se comporta" (que definió `/design-spec`) se traduce en "qué hay que construir y en qué orden", en un documento que sirve de guía para escribir el código.

El ciclo completo del proyecto es: `/brainstorming-code` (qué y por qué) → `/design-spec` (comportamiento esperado) → **`/plan-spec` (el plan técnico)** → implementación → `/verify-spec` (probar y cerrar). Este skill ocupa el eslabón entre la spec aprobada y el código.

Se invoca **solo con una spec aprobada por Leo.** El approval gate de `/design-spec` desemboca acá: si Leo todavía no dio el visto bueno a la spec, este no es el paso —volvé al gate de la spec—. El plan parte de una spec cerrada, no de una en discusión.

La regla que ordena todo, igual que en el resto del proyecto: **no inventar.** Ni tareas que la spec no justifica, ni contenido, ni datos, ni decisiones de producto nuevas. Si para planificar falta algo que la spec no resolvió, no se rellena con algo plausible: se deja un `TODO: pendiente de Leo` y se pregunta (`CLAUDE.md §16`).

## Antes de escribir: recuperar la spec aprobada

No se puede planificar contra algo que no se tiene a la vista.

1. **Ubicá la spec** en `docs/specs/` (la más relacionada con lo que se va a construir) y leela entera, en especial **Alcance v1**, **Comportamiento esperado** y **Posibles errores y mitigaciones**: de ahí salen las tareas.
2. **Confirmá que está aprobada.** Si no hay una spec clara o no fue aprobada, avisá a Leo antes de seguir; sin una referencia cerrada, el plan sería adivinar.
3. **Respetá el alcance v1.** El plan cubre lo que la spec puso dentro de v1, ni más ni menos. Lo que la spec dejó "fuera de v1" no entra en las tareas (a lo sumo se nombra como paso futuro, sin planificarse).

Si la spec está clara y aprobada, no vuelvas a preguntar: pasá a redactar el plan.

## El principio central: el cómo técnico, alineado al stack

A diferencia de la spec —que describe el comportamiento desde el usuario y evita el detalle de implementación—, el plan **sí** entra en el cómo: componentes, archivos, rutas, estructura de datos, dependencias, orden de trabajo. Ese detalle es el valor del plan.

Dos anclas para que el plan sea del proyecto y no genérico:

- **Coherencia con el stack y los principios** (`CLAUDE.md §12`): Next.js (App Router) + TypeScript, Tailwind, contenido en MDX, SSG cuando se pueda, i18n por routing, animaciones primero con CSS + Intersection Observer. **Evitar dependencias innecesarias** y **sin sobreingeniería**: si algo se resuelve simple sin una librería nueva, el plan lo resuelve así.
- **Reutilizar antes que crear** (`/guardian-arquitectura`): antes de listar una tarea que crea un componente, util, hook o ruta, chequeá si ya existe algo reutilizable en el repo. Si el plan va a introducir una dependencia o a tomar una decisión estructural nueva, marcalo explícito en la tarea para que Leo lo vea.

## El documento

**Ubicación y nombre:** `docs/plans/YYYY-MM-DD-title.md`.

- `YYYY-MM-DD` es la fecha de hoy (por ejemplo, `2026-07-12`).
- `title` es un slug corto en minúsculas y con guiones, español neutro, descriptivo del feature. Conviene **reusar el mismo slug de la spec** para que se emparejen a simple vista (por ejemplo, spec `2026-07-12-generador-utm.md` → plan `2026-07-12-generador-utm.md`).
- Si la carpeta `docs/plans/` no existe todavía, se crea.

**Estructura fija — usar exactamente estas cuatro secciones, en este orden:**

```markdown
# [Título del feature] — Plan de implementación

## 1. Objetivo
## 2. Contexto del problema
## 3. Spec de referencia
## 4. Lista de tareas a implementar
```

Qué va en cada una:

1. **Objetivo.** Una o dos frases: qué se va a construir y qué queda funcionando cuando el plan esté ejecutado. Es la meta concreta del plan, no la del sitio entero. Debe poder verificarse después contra `/verify-spec`.

2. **Contexto del problema.** Breve: qué problema resuelve esta funcionalidad y a qué objetivo del sitio sirve (`CLAUDE.md §2`). Se apoya en la spec —no lo repitas entero—; alcanza con lo necesario para que el plan se entienda sin tener que abrir la spec en paralelo.

3. **Spec de referencia.** El enlace o la ruta a la spec aprobada en `docs/specs/` (por ejemplo, `docs/specs/2026-07-12-generador-utm.md`), y una frase que confirme que está aprobada y de qué versión de alcance parte el plan. Es la trazabilidad: cualquiera que lea el plan sabe contra qué spec se validará.

4. **Lista de tareas a implementar.** El corazón del plan. Una lista **ordenada** de tareas concretas, en la secuencia en que conviene abordarlas. Cada tarea, con detalle suficiente para ejecutarla sin volver a diseñar sobre la marcha:
   - **Qué hace** la tarea, en una frase.
   - **Dónde** toca (archivos o rutas concretas: componente, página, util, contenido MDX, etc.).
   - **Detalles técnicos** que importen: props/estructura de datos, estados, validaciones, comportamiento esperado que la tarea cubre.
   - **De qué parte del spec sale** (qué requisito de "Comportamiento esperado", "Alcance v1" o "Posibles errores" satisface), para mantener la trazabilidad.
   - **Dependencia o decisión estructural**, si la tarea introduce una librería nueva o algo que cambie la arquitectura: marcarlo explícito (idealmente ya conversado con `/guardian-arquitectura`).

   Dimensioná las tareas para que sean ejecutables y revisables de a una (Leo revisa y está aprendiendo, `CLAUDE.md §16`): ni una sola tarea gigante, ni veinte micro-tareas triviales. Incluí, cuando la spec lo pida, las tareas de manejo de errores y las de dejar el `dataLayer`/SEO en su lugar (`CLAUDE.md §14`) si corresponden a este feature.

## Al terminar

- Guardá el archivo en `docs/plans/` y confirmale a Leo dónde quedó, con un resumen de una o dos frases del plan.
- Marcá visiblemente cualquier `TODO: pendiente de Leo` o cualquier tarea con una decisión abierta (dependencia nueva, algo que la spec no cerró).
- **No arranques a implementar en la misma pasada** salvo que Leo lo pida. El entregable de este skill es el plan; la implementación —y después `/verify-spec`— vienen como pasos siguientes cuando Leo dé el visto bueno al plan.

## Revisión editorial final (antes de entregar)

El plan es un entregable del repositorio, así que antes de guardarlo verificá (`CLAUDE.md §8`):

- [ ] **Español neutro**, sin voseo (nada de "tenés", "podés", "elegí"; usar "tienes"/"puedes" o formas impersonales).
- [ ] **Ortografía y gramática.**
- [ ] **Una sola voz**, consistente con el resto del proyecto: profesional, cercano, claro, sin marketing vacío.
- [ ] **Nada inventado.** Cada tarea se justifica en la spec; lo que falta está como `TODO`, no rellenado.
- [ ] **Alineado al stack y a los principios** (`CLAUDE.md §12`): sin dependencias evitables, sin sobreingeniería, reutilizando lo que ya existe.

## Reglas innegociables

- **Partir de una spec aprobada.** Sin visto bueno de Leo a la spec, este no es el paso.
- **Las cuatro secciones son fijas**, en el orden dado. No agregar ni quitar secciones del esqueleto.
- **No inventar** tareas que la spec no justifica, ni contenido, ni decisiones de producto nuevas. Ante la duda, preguntar o dejar `TODO:`.
- **Respetar el alcance v1** de la spec: el plan no infla el feature más allá de lo aprobado.
- **Reutilizar antes que crear** y **evitar dependencias innecesarias** (`CLAUDE.md §12`, `/guardian-arquitectura`).
- **No implementar en esta pasada**: el entregable es el plan.
- **Respetar la voz** (`CLAUDE.md §8`): español neutro, sin marketing vacío.
