# spec-design.md

# Especificación del producto

Este documento define el producto desde la perspectiva de negocio y experiencia.

Su objetivo es establecer un criterio claro para todas las decisiones de diseño, implementación y evolución del proyecto.

No describe la interfaz ni el flujo de interacción. Esos aspectos se documentan por separado.

Cuando exista una duda durante el desarrollo, este documento debe utilizarse como la principal referencia para determinar si una decisión acerca o aleja al producto de su propósito.

---

# 1. Propósito

Estamos construyendo una aplicación educativa que utiliza bloques visuales para enseñar a los niños a estructurar ideas antes de comunicarlas a una Inteligencia Artificial.

El verdadero objetivo del producto no es generar prompts.

El verdadero objetivo es desarrollar pensamiento estructurado mediante una experiencia sencilla, divertida y visual.

La Inteligencia Artificial es únicamente el medio para mostrar el resultado del proceso.

---

# 2. Problema que resuelve

Muchos niños tienen imaginación y creatividad, pero pocas herramientas les enseñan cómo organizar una idea antes de expresarla.

La mayoría de experiencias actuales relacionadas con IA comienzan escribiendo texto.

Nuestro producto propone un camino diferente.

Primero pensar.

Después construir.

Finalmente comunicar.

---

# 3. Público objetivo

El MVP está diseñado principalmente para niños entre **9 y 12 años**.

Las decisiones del producto deben favorecer la simplicidad, la exploración y la autonomía.

El usuario debe poder comprender la experiencia sin conocimientos previos sobre Inteligencia Artificial ni sobre prompts.

---

# 4. Resultado esperado

Después de utilizar la aplicación, el niño debería comprender de forma natural que:

* Las ideas pueden dividirse en partes.
* Cambiar una parte modifica el resultado.
* No existe una única respuesta correcta.
* Experimentar también es aprender.
* Una mejor estructura produce mejores resultados.

El aprendizaje debe surgir como consecuencia del juego.

Nunca mediante explicaciones extensas.

---

# 5. Qué estamos construyendo

Estamos construyendo una experiencia educativa.

No estamos construyendo:

* Un chatbot.
* Un editor de texto.
* Un constructor avanzado de prompts.
* Un curso sobre Inteligencia Artificial.
* Una herramienta profesional de Prompt Engineering.

El producto debe sentirse como un juguete creativo.

---

# 6. Principios del producto

Todas las decisiones deben favorecer los siguientes principios.

## Simplicidad

Todo debe ser fácil de comprender.

Cada elemento debe justificar su existencia.

Si una funcionalidad agrega complejidad sin aportar aprendizaje, debe eliminarse.

---

## Curiosidad

La aplicación debe invitar a experimentar.

El usuario debe querer descubrir qué ocurre al combinar diferentes ideas.

---

## Creatividad

El producto debe incentivar la imaginación.

No debe transmitir la sensación de que existe una única forma correcta de construir una idea.

---

## Aprendizaje activo

El usuario aprende interactuando.

La aplicación explica lo mínimo necesario y permite descubrir el resto mediante la experiencia.

---

## Confianza

El niño nunca debe sentir miedo a equivocarse.

Toda combinación debe producir un resultado útil.

---

# 7. Qué nunca debe ocurrir

El producto nunca debe sentirse como:

* Un formulario.
* Un examen.
* Una configuración técnica.
* Una herramienta para expertos.
* Una interfaz compleja.
* Una lista interminable de opciones.

Si una decisión acerca el producto a cualquiera de esos escenarios, debe replantearse.

---

# 8. Criterios de éxito

Una implementación puede considerarse exitosa cuando logra que la mayoría de los usuarios:

* Comprendan rápidamente qué hacer.
* Disfruten experimentar.
* Construyan varias combinaciones por iniciativa propia.
* Entiendan que una idea tiene diferentes componentes.
* Quieran volver a probar nuevas combinaciones.

El éxito del producto no se mide por la cantidad de funcionalidades implementadas.

Se mide por la calidad de la experiencia.

---

# 9. Restricciones del MVP

El MVP debe mantenerse deliberadamente pequeño.

No se deben incorporar funcionalidades únicamente porque podrían ser útiles en el futuro.

Toda nueva funcionalidad debe responder directamente al propósito del producto.

Si una idea no mejora significativamente el aprendizaje o la experiencia principal, debe posponerse para futuras versiones.

---

# 10. Regla para tomar decisiones

Ante cualquier duda relacionada con diseño, desarrollo o evolución del producto, utilizar siempre la siguiente pregunta como criterio:

> **¿Esta decisión ayuda a que un niño aprenda a estructurar mejor sus ideas mientras se divierte?**

Si la respuesta es negativa, esa decisión probablemente no pertenece al MVP.
