import { GeneratedBlock } from '../types'

export async function callGemini(
  systemPrompt: string,
  model: string,
  apiKey: string
): Promise<GeneratedBlock[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!text) throw new Error('Gemini returned empty response')

  const parsed = JSON.parse(text)
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    throw new Error('Gemini response missing "blocks" array')
  }
  return parsed.blocks as GeneratedBlock[]
}
