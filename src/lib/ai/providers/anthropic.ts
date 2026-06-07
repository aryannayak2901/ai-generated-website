import { GeneratedBlock } from '../types'

export async function callAnthropic(
  systemPrompt: string,
  model: string,
  apiKey: string
): Promise<GeneratedBlock[]> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 16384,
      messages: [{ role: 'user', content: systemPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text: string = data?.content?.[0]?.text ?? ''
  if (!text) throw new Error('Anthropic returned empty response')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not find JSON in Anthropic response')

  const parsed = JSON.parse(jsonMatch[0])
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    throw new Error('Anthropic response missing "blocks" array')
  }
  return parsed.blocks as GeneratedBlock[]
}
