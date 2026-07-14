# MVP — Bloques interactivos — Plan de implementación

## 1. Objetivo

Construir la aplicación React + Vite del MVP funcional: cuatro bloques interactivos (Personaje, Acción, Lugar, Estilo) con los que el usuario cicla por opciones mediante flechas, una vista previa del prompt ensamblado en tiempo real, y un botón que envía la combinación a la API de Claude y muestra la historia generada.

Cuando el plan esté ejecutado, un niño podrá abrir la app, combinar bloques y leer una historia creada por la IA a partir de su idea.

---

## 2. Contexto del problema

Los niños tienen imaginación, pero pocas herramientas les enseñan a organizar una idea antes de expresarla.

Este MVP les ofrece cuatro "piezas" de una idea — quién, qué hace, dónde y cómo — para que las combinen visualmente y descubran el resultado en forma de historia. El objetivo no es enseñar prompts: es desarrollar pensamiento estructurado mediante exploración y juego (`docs/spec-design.md §1`).

La IA es el medio para mostrar el resultado del proceso, no el protagonista de la experiencia.

---

## 3. Spec de referencia

| Documento | Alcance |
|-----------|---------|
| `docs/specs/2026-07-13-vision-filosofia-mvp.md` | Spec principal aprobada — visión, filosofía y principios |
| `docs/blocks.md` | Definición de los cuatro bloques, opciones, ensamblado del prompt y plantilla para Claude |
| `docs/gameplay.md` | Ciclo principal del juego (Explorar → Construir → Descubrir → Experimentar → Repetir) |
| `docs/interaction.md` | Reglas de interacción: claridad, inmediatez, reversibilidad, manejo de errores |
| `docs/spec-design.md` | Propósito del producto y criterios de calidad de la experiencia |
| `docs/ui.md` | Dirección visual: estructura de pantalla, colores por categoría, tipografía, tarjeta de resultado y restricciones visuales |

El plan parte del Alcance v1 definido en la documentación: cuatro bloques fijos, cinco opciones por bloque, interacción por clic (sin drag and drop), vista previa en tiempo real, generación de historia vía Claude, y la dirección visual definida en `docs/ui.md`.

---

## 4. Lista de tareas a implementar

### Tarea 1 — Scaffolding del proyecto React + Vite

**Qué hace:** Inicializa el proyecto con la estructura base, las dependencias del stack y la configuración de la variable de entorno.

**Dónde toca:**
- Raíz del proyecto: `package.json`, `index.html`, `vite.config.js`
- Variables de entorno: `.env` (local, nunca en repositorio), `.gitignore`
- Estructura de carpetas: `src/`

**Detalles técnicos:**
- Ejecutar `npm create vite@latest . -- --template react` en la raíz del proyecto
- Instalar la dependencia del SDK: `npm install @anthropic-ai/sdk`
- Crear `.env` en la raíz con `VITE_ANTHROPIC_API_KEY=<clave>`
- Verificar que `.env` esté listado en `.gitignore` antes de continuar
- Limpiar el contenido de ejemplo que genera Vite (App.jsx, App.css, index.css) para partir desde una base limpia

**Referencia en la spec:** `CLAUDE.md §7` — stack técnico, variables de entorno, eliminación de servidor separado.

---

### Tarea 2 — Middleware de API en Vite (`/api/generate`)

**Qué hace:** Agrega un endpoint POST `/api/generate` al servidor de desarrollo de Vite que recibe el prompt ensamblado, llama a la API de Gemini del lado del servidor y devuelve la historia generada como texto.

**Dónde toca:** `vite.config.js` — función `configureServer` dentro de `defineConfig`.

**Detalles técnicos:**
- El endpoint recibe `{ prompt }` en el cuerpo de la petición (JSON)
- Instancia `GoogleGenAI` con `env.GEMINI_API_KEY` (cargada vía `loadEnv`) — acceso server-side, nunca expuesto al cliente
- Llama a `models.generateContent` con modelo `gemini-2.5-flash` (buen balance de costo/velocidad para historias cortas de 3 párrafos)

- La instrucción enviada a Gemini sigue exactamente la plantilla de `docs/blocks.md §4`:
  ```
  Escribe una historia corta, creativa y [estilo] sobre [personaje] que [acción] [lugar].
  La historia debe tener máximo 3 párrafos cortos.
  Usa un lenguaje sencillo para un niño de 10 años.
  Hazla entretenida y con un final inesperado.
  Responde solo con el texto de la historia, en texto plano, sin markdown ni asteriscos.
  ```
- El endpoint devuelve `{ story: "<texto>" }` en caso de éxito o `{ error: "<mensaje>" }` en caso de fallo
- En caso de error de la API, registrar el error en `console.error` (server-side) y devolver un mensaje genérico al cliente — no exponer detalles técnicos

**Referencia en la spec:** `CLAUDE.md §7` — Vite middleware como proxy para evitar exponer la API key. `docs/blocks.md §4` — plantilla exacta del prompt enviado a la IA.

> Nota (2026-07-13): esta tarea se implementó con Gemini (`@google/genai`) en vez de Claude — decisión documentada en `CLAUDE.md §7`.

---

### Tarea 3 — Datos de los bloques (`src/data/blocks.js`)

**Qué hace:** Define los cuatro bloques y sus opciones como datos puros, separados de la UI, para que sean la única fuente de verdad del contenido.

**Dónde toca:** `src/data/blocks.js` (archivo nuevo)

**Detalles técnicos:**
- Exporta un array `BLOCKS` con exactamente cuatro objetos, en el orden de ensamblado: Personaje → Acción → Lugar → Estilo
- Estructura de cada objeto:
  ```js
  { id: 'personaje', label: '¿Quién?', options: [{ emoji: '🤖', text: 'Un robot' }, ...] }
  ```
- Los datos son exactamente los de `docs/blocks.md §2` — sin agregar ni quitar opciones ni cambiar el texto

**Referencia en la spec:** `docs/blocks.md §2` — tablas completas de opciones por bloque.

---

### Tarea 4 — Componente `Block`

**Qué hace:** Renderiza un único bloque con su etiqueta, la opción activa (emoji + texto) y dos flechas para ciclar entre las opciones hacia adelante y hacia atrás.

**Dónde toca:**
- `src/components/Block.jsx` (componente nuevo)
- `src/components/Block.css` (estilos del bloque)

**Detalles técnicos:**
- Props: `block` (objeto con `id`, `label` y `options`), `selectedIndex` (número), `onPrev` (función), `onNext` (función)
- Estructura visual:
  - Etiqueta (`label`) en la parte superior del bloque
  - Emoji de la opción activa, tamaño grande (2.5–3rem)
  - Texto de la opción activa debajo del emoji
  - Flecha `◀` a la izquierda, flecha `▶` a la derecha
- Estilo del bloque (`docs/ui.md §Bloques`): rectángulo con bordes redondeados y sombra suave
- Color por categoría, aplicado según `block.id` (`docs/ui.md §Categorías y colores`):
  - Personaje: `#7C5CFC`
  - Acción: `#FF8A3D`
  - Lugar: `#2FBF9B`
  - Estilo: `#F4C542`
- El cambio de opción es inmediato al hacer clic — sin demora ni animación bloqueante
- Puede tener una microinteracción ligera (por ejemplo, una transición CSS breve de opacidad o escala al cambiar) para reforzar el feedback visual — solo animaciones CSS breves y simples, sin animaciones avanzadas (`docs/ui.md §Interacción visual`, `§Restricciones`)
- El componente es stateless: todo el estado vive en el padre

**Referencia en la spec:** `docs/blocks.md §5` — el bloque siempre tiene una opción activa; el cambio es inmediato y visible. `docs/interaction.md §4` — retroalimentación inmediata en cada acción. `docs/interaction.md §8` — las microinteracciones tienen un propósito. `CLAUDE.md §10` — interacción por clic con flechas. `docs/ui.md §Bloques`, `§Categorías y colores` — estilo del rectángulo y color por categoría.

---

### Tarea 5 — App principal y estado de selección (`src/App.jsx`)

**Qué hace:** Compone los cuatro bloques en la pantalla y mantiene el estado de qué opción está activa en cada uno.

**Dónde toca:** `src/App.jsx`

**Detalles técnicos:**
- Estado: `selectedIndices` — array de 4 enteros inicializado en `[0, 0, 0, 0]`
- Renderiza los cuatro componentes `Block` en un contenedor horizontal
- Manejadores de navegación:
  - `handlePrev(blockIndex)`: `(current - 1 + options.length) % options.length`
  - `handleNext(blockIndex)`: `(current + 1) % options.length`
- Cada `Block` recibe su bloque de datos, el índice seleccionado y los dos manejadores correspondientes

**Referencia en la spec:** `docs/blocks.md §5` — ciclo circular de opciones; la app siempre inicia con la primera opción de cada bloque. `docs/interaction.md §5` — el usuario puede modificar cualquier decisión en cualquier momento.

---

### Tarea 6 — Vista previa del prompt en tiempo real

**Qué hace:** Muestra debajo de los bloques el texto ensamblado con la idea del niño, que se actualiza en cada cambio de bloque.

**Dónde toca:** `src/App.jsx` (valor derivado calculado en el render, sin estado adicional)

**Detalles técnicos:**
- Frase ensamblada: `` `${personaje.text} ${acción.text} ${lugar.text} ${estilo.text}.` ``
- Ejemplo: `Un robot cocina en el espacio de forma divertida.`
- Es un valor derivado puro de `selectedIndices` y `BLOCKS` — no requiere `useState` ni `useEffect`
- Se renderiza siempre visible, antes del botón de generar

**Referencia en la spec:** `docs/blocks.md §3` — estructura exacta del prompt ensamblado y ejemplo. `docs/interaction.md §3` — toda construcción debe producir una respuesta visible; la app debe comunicar que la idea está tomando forma.

---

### Tarea 7 — Botón "Generar historia" y llamada a la API

**Qué hace:** Agrega el botón principal de la app; al pulsarlo, construye la instrucción completa, la envía al endpoint `/api/generate` y gestiona el estado de carga.

**Dónde toca:** `src/App.jsx`

**Detalles técnicos:**
- Estado adicional: `loading` (boolean, inicia en `false`), `story` (string | null), `error` (string | null)
- Al hacer clic:
  1. Construye el prompt completo con la plantilla de `docs/blocks.md §4`, interpolando los valores actuales de los bloques
  2. Llama a `fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })`
  3. Mientras espera, `loading = true` y el botón se deshabilita
- El botón muestra un texto alternativo durante la carga, por ejemplo: `Inventando tu historia…`
- Al recibir respuesta exitosa: guarda `story`, limpia `error`, `loading = false`
- Al recibir error: guarda `error`, limpia `story`, `loading = false`

**Referencia en la spec:** `docs/gameplay.md §5` — la app genera un resultado que representa la idea completa. `docs/interaction.md §7` — cuando ocurre una situación inesperada, la respuesta es clara y amable.

---

### Tarea 8 — Tarjeta de resultado (historia generada, "Copiar idea" y "Empezar de nuevo")

**Qué hace:** Muestra la historia generada por Claude en una tarjeta de resultado, visible por debajo del botón, con feedback amigable durante la carga y dos acciones: copiar el texto y reiniciar la construcción.

**Dónde toca:** `src/App.jsx` (renderizado condicional inline — no justifica un componente separado en el MVP)

**Detalles técnicos:**
- Durante la carga (`loading === true`): muestra un mensaje de espera amigable, por ejemplo: `La IA está inventando tu historia…`
- Cuando `story !== null`: muestra una tarjeta con el texto de la historia (párrafos preservados con `white-space: pre-wrap` o renderizado por párrafos), un botón **"Copiar idea"** y una acción **"Empezar de nuevo"** (`docs/ui.md §Resultado`)
- **"Copiar idea"**: copia el texto de `story` al portapapeles con `navigator.clipboard.writeText(story)`; muestra una confirmación breve y amable (por ejemplo, el botón cambia a "¡Copiado!" por ~1.5s) — sin `alert()` ni mensajes técnicos
- **"Empezar de nuevo"**: reinicia `selectedIndices` a `[0, 0, 0, 0]` y limpia `story` y `error`, dejando la app lista para una nueva combinación desde la primera opción de cada bloque
- La tarjeta aparece debajo del botón; los bloques permanecen visibles y modificables — el niño puede cambiar una opción y generar de nuevo sin recargar la página
- No existe un botón separado de "borrar historia": explorar una nueva combinación reemplaza el resultado anterior, y "Empezar de nuevo" cubre el caso de reinicio completo

**Referencia en la spec:** `docs/gameplay.md §6`, `§7` — el usuario modifica bloques, observa el nuevo resultado, y siempre existe una razón para seguir explorando. `docs/interaction.md §1` — toda interacción debe ser reversible (los bloques siempre son editables). `docs/ui.md §Resultado` — tarjeta con texto generado, botón "Copiar idea" y acción "Empezar de nuevo".

---

### Tarea 9 — Manejo de error amigable

**Qué hace:** Cuando la llamada a la API falla, muestra un mensaje comprensible para un niño en lugar de un error técnico.

**Dónde toca:** `src/App.jsx` (renderizado condicional de `error`)

**Detalles técnicos:**
- Renderiza el mensaje solo cuando `error !== null`
- Texto sugerido: `¡Ups! Algo salió mal. Intenta de nuevo.`
- El mensaje de error no bloquea la interacción con los bloques ni deshabilita el botón
- Después de un nuevo intento exitoso, `error` vuelve a `null` y el mensaje desaparece

**Referencia en la spec:** `docs/interaction.md §7` — nunca usar mensajes técnicos; nunca bloquear la exploración.

---

### Tarea 10 — Estilos visuales globales

**Qué hace:** Define el aspecto visual de la app — colores, tipografía, layout — alineado con la sensación de juguete educativo para niños de 9-12 años.

**Dónde toca:**
- `src/index.css` — reset CSS y variables globales de color y tipografía
- `src/App.css` — layout general: centrado, columna principal, fila de bloques

**Detalles técnicos:**
- Layout: página centrada con `max-width` razonable (aprox. 900px), bloques en fila con `flexbox`, `gap` generoso. En escritorio, selección de opciones a la izquierda y construcción/resultado a la derecha; en móvil, todo en una sola columna (`docs/ui.md §Estructura`)
- Una sola pantalla — no agregar rutas ni pasos adicionales (`docs/ui.md §Restricciones`)
- Tipografía: fuente del sistema (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) — cumple la opción `system-ui` de `docs/ui.md §Tipografía` sin agregar una fuente externa (`Nunito`/`Nunito Sans` quedan descartadas para no sumar una dependencia de carga)
- Tamaños legibles para niños: texto base ≥ 16px, emojis en los bloques 2.5–3rem
- Colores base (`docs/ui.md §Categorías y colores`):
  - Fondo: `#F7F8FC`
  - Superficies: `#FFFFFF`
  - Texto: `#1F2937`
- Los cuatro colores de categoría (Personaje, Acción, Lugar, Estilo) ya se definen en la Tarea 4 y se aplican en `Block.css`
- Botón principal ("Generar historia") grande y llamativo, consistente con la paleta base
- Responsive básico: que funcione en pantallas de tablet (768px+) y desktop
- No implementar: modo oscuro, sonidos, confeti, animaciones avanzadas ni librerías visuales adicionales (`docs/ui.md §Restricciones`)
- Los estilos específicos del bloque (flecha, fondo, hover) ya se cubren en `Block.css` (Tarea 4)

**Referencia en la spec:** `CLAUDE.md §5` — simplicidad, curiosidad, exploración. `docs/spec-design.md §7` — el producto nunca debe sentirse como un formulario ni una interfaz compleja. `docs/spec-design.md §8` — el usuario debe comprender rápidamente qué hacer. `docs/ui.md §Dirección visual`, `§Estructura`, `§Tipografía`, `§Restricciones` — dirección visual completa del MVP.
