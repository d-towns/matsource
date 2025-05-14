import { z } from 'zod';

export const AgentTypeEnum = z.enum(['inbound_voice', 'outbound_voice', 'browser']);
export const LLMProvidersEnum = z.enum(['groq', 'openai']);
export const STTProvidersEnum = z.enum(['elevenlabs', 'openai', 'groq']);
export const TTSProvidersEnum = z.enum(['elevenlabs', 'openai', 'csm-1', 'groq']);

export const AgentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable().optional(),
  name: z.string(),
  type: AgentTypeEnum,
  script: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).nullable().optional(),
  ai_provider: z.string().default('openai'),
  ai_provider_agent_id: z.string().nullable().optional(),
  team_id: z.string().uuid(),
  tts_provider: TTSProvidersEnum,
  stt_provider: STTProvidersEnum,
  llm_provider: LLMProvidersEnum,
  phone_number: z.string().uuid().nullable().optional(),
});

export type Agent = z.infer<typeof AgentSchema>; 