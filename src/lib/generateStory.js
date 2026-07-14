// Plantilla exacta de docs/blocks.md §4.
function buildPrompt({ personaje, accion, lugar, estilo }) {
  return `Escribe una historia corta, creativa y ${estilo} sobre ${personaje} que ${accion} ${lugar}.
La historia debe tener máximo 3 párrafos cortos.
Usa un lenguaje sencillo para un niño de 10 años.
Hazla entretenida y con un final inesperado.
Envuelve la primera mención de cada elemento con una etiqueta: <personaje>...</personaje>, <accion>...</accion>, <lugar>...</lugar>, <estilo>...</estilo>. Una sola vez cada una, sin anidarlas.
Responde solo con el texto de la historia usando esas etiquetas, en texto plano, sin markdown, sin asteriscos y sin ninguna otra etiqueta.`
}

export async function generateStory({ personaje, accion, lugar, estilo }) {
  const prompt = buildPrompt({ personaje, accion, lugar, estilo })

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo generar la historia')
  }

  return data.story
}
