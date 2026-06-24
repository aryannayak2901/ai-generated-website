import { NextRequest, NextResponse } from 'next/server';
import { runAgent } from '@/lib/ai/agent';
import { GenerateRequest } from '@/lib/ai/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { prompt, mode, provider, model, apiKey } = body;

  if (!prompt?.trim()) return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
  if (!apiKey?.trim()) return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendLog = (message: string) => {
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'log', message }) + '\n'));
      };

      try {
        const blocks = await runAgent(prompt, mode, provider, model, apiKey, sendLog);
        
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: 'result',
              data: {
                success: true,
                mode: 'code',
                blocks: blocks.map((block) => ({
                  blockType: block.blockType,
                  componentName: block.componentName,
                  label: block.label,
                  category: block.category,
                  icon: block.icon,
                  badgeLabel: block.badgeLabel,
                  componentCode: block.componentCode,
                  payloadConfigCode: block.payloadConfigCode,
                  defaultValues: block.defaultValues,
                  blockMetaPatch: block.blockMetaPatch,
                  renderBlocksPatch: block.renderBlocksPatch,
                  pagesBlocksPatch: block.pagesBlocksPatch,
                })),
              },
            }) + '\n'
          )
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message }) + '\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
