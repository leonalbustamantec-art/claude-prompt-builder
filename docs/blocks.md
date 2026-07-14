# blocks.md

# Los bloques del MVP

Este documento define los cuatro bloques del MVP, sus opciones y cómo se ensamblan para generar el prompt que se envía a la IA.

---

# 1. Qué es un bloque

Un bloque representa una única parte de una idea.

El niño elige una opción dentro de cada bloque haciendo clic en las flechas laterales.

Cada combinación de bloques produce una frase diferente.

---

# 2. Los cuatro bloques

## Bloque 1 — Personaje

**Etiqueta visible:** ¿Quién?

**Opciones:**

| Emoji | Texto         |
|-------|---------------|
| 🤖    | Un robot      |
| 🧙    | Un mago       |
| 🦕    | Un dinosaurio |
| 👩‍🚀    | Una astronauta |
| 🦁    | Un león       |

---

## Bloque 2 — Acción

**Etiqueta visible:** ¿Qué hace?

**Opciones:**

| Emoji | Texto              |
|-------|--------------------|
| 🍳    | cocina             |
| 🔍    | explora            |
| 🏗️    | construye          |
| 💡    | descubre secretos  |
| 📚    | enseña             |

---

## Bloque 3 — Lugar

**Etiqueta visible:** ¿Dónde?

**Opciones:**

| Emoji | Texto               |
|-------|---------------------|
| 🚀    | en el espacio       |
| 🌊    | en el fondo del mar |
| 🌿    | en la selva         |
| 🌆    | en el futuro        |
| 🏰    | en un castillo      |

---

## Bloque 4 — Estilo

**Etiqueta visible:** ¿Cómo?

**Opciones:**

| Emoji | Texto         |
|-------|---------------|
| 😄    | de forma divertida   |
| 🔮    | de forma misteriosa  |
| ⚡    | de forma emocionante |
| 🌙    | de forma tranquila   |
| 🤩    | de forma sorprendente |

---

# 3. Cómo se ensambla el prompt

Los cuatro bloques se combinan en la siguiente estructura:

```
[Personaje] [Acción] [Lugar] [Estilo].
```

**Ejemplo:**

> Un robot cocina en el espacio de forma divertida.

Esta frase es el texto que ve el niño en la vista previa.

---

# 4. Qué se envía a la IA

El texto ensamblado no se envía directamente como prompt.

Se usa como base para construir una instrucción más rica para Claude:

```
Escribe una historia corta, creativa y [estilo] sobre [personaje] que [acción] [lugar].
La historia debe tener máximo 3 párrafos cortos.
Usa un lenguaje sencillo para un niño de 10 años.
Hazla entretenida y con un final inesperado.
Envuelve la primera mención de cada elemento con una etiqueta: <personaje>...</personaje>, <accion>...</accion>, <lugar>...</lugar>, <estilo>...</estilo>. Una sola vez cada una, sin anidarlas.
Responde solo con el texto de la historia usando esas etiquetas, en texto plano, sin markdown, sin asteriscos y sin ninguna otra etiqueta.
```

Las cuatro etiquetas (`<personaje>`, `<accion>`, `<lugar>`, `<estilo>`) permiten resaltar en pantalla, con el color de cada categoría (`docs/ui.md §Categorías y colores`), qué parte de la historia corresponde a qué bloque. Ver `docs/specs/2026-07-13-nuevas-interacciones-mvp.md §Resaltado de piezas en la historia`.

---

# 5. Reglas de los bloques

* Cada bloque siempre tiene una opción activa. No existe estado vacío.
* El niño nunca puede construir una idea incompleta.
* Al iniciar la app, cada bloque muestra la primera opción de su lista.
* El cambio de opción es inmediato y visible.
* La vista previa del prompt se actualiza en tiempo real al cambiar cualquier bloque.
