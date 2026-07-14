import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { GoogleGenAI } from '@google/genai'

// Proxy de /api/generate: llama a Gemini del lado del servidor para que la
// API key nunca llegue al bundle del cliente (CLAUDE.md §7).
function generateStoryApi(env) {
  return {
    name: 'generate-story-api',
    configureServer(server) {
      const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }

        let body = ''
        for await (const chunk of req) body += chunk

        res.setHeader('Content-Type', 'application/json')

        try {
          const { prompt } = JSON.parse(body)
          const result = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
          })
          res.end(JSON.stringify({ story: result.text }))
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'No se pudo generar la historia' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), generateStoryApi(env)],
  }
})
