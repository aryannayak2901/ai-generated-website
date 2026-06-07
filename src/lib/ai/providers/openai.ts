import { GeneratedBlock } from '../types'

export async function callOpenAI(
  prompt: { system: string; user: string },
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
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 8192,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text: string = data?.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('OpenAI returned empty response')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not find JSON in OpenAI response')

  const parsed = JSON.parse(jsonMatch[0])
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    throw new Error('OpenAI response missing "blocks" array')
  }
  return parsed.blocks as GeneratedBlock[]
}
