import { GenerateResponseWithCode, AIProvider, GenerationMode } from '@/lib/ai/types';

export interface GenerationHistoryItem {
  id: string;
  prompt: string;
  mode: GenerationMode;
  provider: AIProvider;
  model: string;
  timestamp: number;
  response: GenerateResponseWithCode;
}
