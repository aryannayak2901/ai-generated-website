import { GeneratedBlock } from '../types'

export async function callGemini(
  prompt: { system: string; user: string },
  model: string,
  apiKey: string
): Promise<GeneratedBlock[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: prompt.system }]
      },
      contents: [{ parts: [{ text: prompt.user }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
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

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not find JSON in Gemini response')

  const parsed = JSON.parse(jsonMatch[0])
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    throw new Error('Gemini response missing "blocks" array')
  }
  return parsed.blocks as GeneratedBlock[]
}
