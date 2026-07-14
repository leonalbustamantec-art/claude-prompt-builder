import { GoogleGenAI } from '@google/genai'

// Función serverless de Vercel: equivalente en producción al middleware de
// /api/generate en vite.config.js (que solo corre en `vite dev`).
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  try {
    const { prompt } = req.body
    const result = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    })
    res.status(200).json({ story: result.text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo generar la historia' })
  }
}
