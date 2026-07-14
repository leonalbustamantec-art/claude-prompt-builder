# CLAUDE.md

Memoria permanente del proyecto.

Este documento define la visión, los principios y las reglas generales del producto.

**Debe leerse antes de tomar cualquier decisión de diseño, experiencia, arquitectura o implementación.**

La especificación detallada del producto vive dentro de la carpeta `/docs`, mientras que este documento representa la constitución del proyecto.

---

# 1. Qué es este proyecto

Estamos construyendo una aplicación web educativa inspirada en los bloques de LEGO y en la simplicidad de Scratch.

El objetivo **no es enseñar programación**.

El objetivo es enseñar a estructurar ideas mediante bloques visuales para construir mejores preguntas e instrucciones para una Inteligencia Artificial.

El producto debe sentirse como un **juguete educativo**, no como una herramienta técnica.

Cada decisión debe reforzar esa sensación.

---

# 2. Objetivo del MVP

Construir una experiencia extremadamente simple donde un niño pueda crear una idea mediante bloques visuales y obtener un prompt listo para utilizar con una IA.

El MVP debe ser intuitivo.

Si un niño necesita leer un manual para entender cómo funciona, el diseño falló.

La prioridad no es la cantidad de funcionalidades, sino la facilidad con la que el usuario comprende la experiencia.

---

# 3. Público objetivo

Público principal:

**Niños entre 9 y 12 años.**

Todo el lenguaje, las ilustraciones, las animaciones y las interacciones deben diseñarse pensando en esa edad.

El producto también debe poder utilizarse como apoyo en entornos educativos, talleres o colegios.

---

# 4. Filosofía del producto

Este proyecto no busca enseñar Prompt Engineering.

Busca enseñar pensamiento estructurado.

Cada bloque representa una parte de una idea.

Los niños no construyen prompts.

Construyen ideas.

El prompt es únicamente el resultado final de organizar correctamente esas ideas.

La interfaz debe ayudar al usuario a pensar antes de escribir.

---

# 5. Principios de diseño

Siempre priorizar:

* Simplicidad.
* Curiosidad.
* Exploración.
* Juego.
* Descubrimiento.
* Aprendizaje mediante la experimentación.

Evitar:

* Interfaces complejas.
* Pantallas sobrecargadas.
* Exceso de texto.
* Configuraciones avanzadas.
* Terminología técnica.
* Opciones innecesarias.

Cada elemento de la interfaz debe ser comprensible para un niño sin necesidad de explicación.

Toda animación debe tener un propósito educativo o mejorar la comprensión.

---

# 6. Principios técnicos

Mantener el proyecto pequeño.

No agregar dependencias innecesarias.

No implementar funcionalidades futuras.

Construir únicamente aquello que aporte valor al MVP.

Siempre favorecer:

* Código limpio.
* Componentes reutilizables.
* Arquitectura sencilla.
* Legibilidad.
* Mantenibilidad.

La claridad siempre tiene prioridad sobre la sofisticación técnica.

---

# 7. Stack técnico

El MVP se construye con **React + Vite**.

Dependencias del proyecto:

* `react` + `react-dom` — interfaz de usuario.
* `@google/genai` — integración con la API de Gemini.
* Vite middleware (en `vite.config.js`) — proxy del lado del servidor para `/api/generate` en desarrollo. Evita exponer la API key en el cliente.
* Función serverless de Vercel (en `api/generate.js`) — mismo proxy, pero para producción. Vercel expone automáticamente todo archivo dentro de `/api` como endpoint.

Variables de entorno:

* `GEMINI_API_KEY` — clave de la API de Gemini. En local se define en un archivo `.env` que nunca se sube al repositorio. En Vercel se define como variable de entorno del proyecto (dashboard → Settings → Environment Variables). Sin prefijo `VITE_` a propósito: así el proxy del servidor la lee del lado del servidor, pero nunca queda expuesta al bundle del cliente.

Despliegue:

* La app está desplegada en Vercel. `vite.config.js` maneja `/api/generate` en desarrollo y `api/generate.js` lo maneja en producción — ambos comparten la misma lógica y deben mantenerse sincronizados si cambia el contrato de la API.

---

# 8. Estado actual

El proyecto se encuentra en **Sprint 1 (Implementación del MVP)**, desplegado en GitHub y Vercel.

Las decisiones de producto, diseño e interacción están documentadas en `/docs`.

Toda la documentación dentro de `/docs` constituye la fuente de verdad del producto y debe mantenerse sincronizada con el desarrollo.

---

# 9. Cómo debe trabajar Claude

## 9.1 Leer la documentación antes de implementar

Antes de desarrollar cualquier funcionalidad, revisar la documentación correspondiente dentro de `/docs`.

No asumir comportamientos que no estén definidos.

Si existe una contradicción entre el código y la documentación, la documentación prevalece.

---

## 9.2 No reinventar decisiones

Antes de proponer una solución nueva, revisar si ya existe una decisión documentada.

Si existe, respetarla.

Si consideras que esa decisión debería cambiar, justificar primero la propuesta antes de modificarla.

---

## 9.3 Pensar como diseñador de producto

No limitarte a escribir código.

Antes de implementar una funcionalidad, analizar si realmente mejora la experiencia del niño.

Si una solución es técnicamente correcta pero resulta más difícil de comprender para el usuario, elegir siempre la opción más simple.

La experiencia del usuario tiene prioridad sobre la sofisticación técnica.

---

## 9.4 No inventar funcionalidades

No agregar características porque "podrían ser útiles".

El MVP debe mantenerse deliberadamente pequeño.

Toda funcionalidad nueva debe responder a un objetivo documentado del producto.

---

## 9.5 Explicar las decisiones importantes

Cuando una decisión de arquitectura, UX o implementación sea relevante, explicar brevemente el motivo.

La documentación del proyecto debe facilitar que cualquier persona pueda entender cómo evoluciona el producto.

---

## 9.6 Mantener actualizado este documento

Si durante el desarrollo cambia una decisión estructural del proyecto, este archivo debe actualizarse para reflejar la nueva realidad.

`CLAUDE.md` representa la memoria permanente del proyecto y siempre debe mantenerse vigente.

---

# 10. Bloques del MVP

Los cuatro bloques del MVP y su interacción están definidos en `docs/blocks.md`.

La interacción con los bloques es **por clic**: cada bloque muestra una opción activa y el usuario hace clic en flechas o en el propio bloque para ciclar entre las opciones disponibles. No hay drag and drop en el MVP.
