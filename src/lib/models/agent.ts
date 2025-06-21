import { z } from 'zod';

export const AgentTypeEnum = z.enum(['inbound_voice', 'outbound_voice', 'browser']);
export const LLMProvidersEnum = z.enum(['groq', 'openai']);
export const STTProvidersEnum = z.enum(['groq', 'openai', 'elevenlabs',]);
export const TTSProvidersEnum = z.enum(['elevenlabs', 'openai', 'playai', 'groq']);

// Voice schema for nested voice object
export const VoiceSchema = z.object({
  id: z.string().uuid(),
  provider: TTSProvidersEnum,
  voice_id: z.string(), // This is the provider's voice identifier
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  preview_url: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Model schema for nested model object
export const ModelSchema = z.object({
  id: z.string().uuid(),
  provider: LLMProvidersEnum,
  model_name: z.string(),
  tier: z.enum(['basic', 'premium']),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

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
  voice_id: z.string().uuid().nullable().optional(),
  llm_model_id: z.string().uuid().nullable().optional(),
  // Nested objects from joins
  voices: VoiceSchema.nullable().optional(),
  models: ModelSchema.nullable().optional(),
});

export type Agent = z.infer<typeof AgentSchema>;
export type Voice = z.infer<typeof VoiceSchema>;
export type Model = z.infer<typeof ModelSchema>; 