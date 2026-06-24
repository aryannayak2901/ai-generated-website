import fs from 'fs/promises';
import path from 'path';
import { GeneratedBlock } from './types';
import { buildSystemPrompt } from './buildSystemPrompt';

export async function callUnifiedLLM(
  provider: string,
  model: string,
  apiKey: string,
  systemPrompt: string,
  messages: { role: 'user' | 'assistant', content: string }[]
): Promise<string> {
  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages,
        generationConfig: { temperature: 0.4, maxOutputTokens: 8192, responseMimeType: 'application/json' },
      }),
    });
    if (!response.ok) throw new Error(`Gemini API error: ${await response.text()}`);
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }

  if (provider === 'anthropic') {
    const url = 'https://api.anthropic.com/v1/messages';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: 4096,
        temperature: 0.4
      }),
    });
    if (!response.ok) throw new Error(`Anthropic API error: ${await response.text()}`);
    const data = await response.json();
    return data.content[0].text;
  }

  // OpenAI-compatible providers
  let url = '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  if (provider === 'openai') url = 'https://api.openai.com/v1/chat/completions';
  else if (provider === 'openrouter') {
    url = 'https://openrouter.ai/api/v1/chat/completions';
    headers['HTTP-Referer'] = 'https://chambers.com';
  }
  else if (provider === 'groq') url = 'https://api.groq.com/openai/v1/chat/completions';
  else if (provider === 'mistral') url = 'https://api.mistral.ai/v1/chat/completions';
  else if (provider === 'together') url = 'https://api.together.xyz/v1/chat/completions';
  else throw new Error(`Unsupported provider: ${provider}`);

  const openAiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  const body: any = {
    model,
    messages: openAiMessages,
    temperature: 0.4,
  };

  if (provider === 'openai') {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`${provider} API error: ${await response.text()}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

export async function runAgent(
  userPrompt: string,
  mode: 'block' | 'page',
  provider: string,
  model: string,
  apiKey: string,
  log: (message: string) => void
): Promise<GeneratedBlock[]> {

  const projectRoot = process.cwd();
  
  // Reuse the existing system prompt but add tool instructions
  const { system, user } = await buildSystemPrompt(userPrompt, mode);
  
  const agentSystemPrompt = `
${system}

--- AGENT CAPABILITIES ---
You are an autonomous codebase-aware agent. You can explore the codebase before generating the final result.
You must output a JSON object in EXACTLY one of the following formats:

1. To read a file:
{
  "action": "readFile",
  "path": "src/components/blocks/ExampleBlock.tsx"
}

2. To list a directory:
{
  "action": "listDirectory",
  "path": "src/components/blocks"
}

3. To finish and return the generated blocks:
{
  "action": "done",
  "blocks": [ ... ] // Array of GeneratedBlock objects as defined in the schema above
}

Always respond with EXACTLY one of these JSON objects. Do not wrap in markdown or add text outside the JSON.
Analyze the user's request. If you need to see existing components or pages to understand the context, use listDirectory and readFile. Once you have enough context, return the "done" action with the blocks.
`;

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    { role: 'user', content: user }
  ];

  let maxIterations = 10;
  let iteration = 0;

  while (iteration < maxIterations) {
    iteration++;
    log(`Thinking (Iteration ${iteration})...`);

    let text = '';
    try {
      text = await callUnifiedLLM(provider, model, apiKey, agentSystemPrompt, messages);
    } catch (err: any) {
      throw new Error(`LLM API error: ${err.message}`);
    }
    
    if (!text) {
      throw new Error('Empty response from LLM');
    }

    messages.push({ role: 'assistant', content: text });

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('LLM did not return valid JSON');
      }
    }

    if (parsed.action === 'done') {
      log('Generation complete.');
      if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
        throw new Error('Agent returned "done" but missing "blocks" array.');
      }
      return parsed.blocks;
    } else if (parsed.action === 'readFile') {
      log(`Reading file: ${parsed.path}`);
      try {
        const fullPath = path.resolve(projectRoot, parsed.path);
        if (!fullPath.startsWith(projectRoot)) {
          throw new Error('Path outside project root');
        }
        const content = await fs.readFile(fullPath, 'utf-8');
        messages.push({ role: 'user', content: `File content of ${parsed.path}:\n${content}` });
      } catch (err: any) {
        log(`Error reading file: ${err.message}`);
        messages.push({ role: 'user', content: `Error reading file ${parsed.path}: ${err.message}` });
      }
    } else if (parsed.action === 'listDirectory') {
      log(`Listing directory: ${parsed.path}`);
      try {
        const fullPath = path.resolve(projectRoot, parsed.path);
        if (!fullPath.startsWith(projectRoot)) {
          throw new Error('Path outside project root');
        }
        const files = await fs.readdir(fullPath);
        messages.push({ role: 'user', content: `Contents of directory ${parsed.path}:\n${files.join('\n')}` });
      } catch (err: any) {
        log(`Error listing directory: ${err.message}`);
        messages.push({ role: 'user', content: `Error listing directory ${parsed.path}: ${err.message}` });
      }
    } else {
      log(`Unknown action: ${parsed.action}`);
      messages.push({ role: 'user', content: `Unknown action: ${parsed.action}. Please respond with valid action JSON.` });
    }
  }

  throw new Error('Agent exceeded maximum iterations');
}
