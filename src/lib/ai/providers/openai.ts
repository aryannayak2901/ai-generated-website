import { GeneratedBlock } from '../types'

export async function callOpenAI(
  systemPrompt: string,
  model: string,
  apiKey: string
): Promise<GeneratedBlock[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: systemPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 16384,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text: string = data?.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('OpenAI returned empty response')

  const parsed = JSON.parse(text)
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    throw new Error('OpenAI response missing "blocks" array')
  }
  return parsed.blocks as GeneratedBlock[]
}
