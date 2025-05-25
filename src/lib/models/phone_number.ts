import { z } from 'zod'

// Verification status enum
export const VerificationStatusEnum = z.enum(['pending', 'success', 'failed'])

// Phone number type enum
export const PhoneNumberTypeEnum = z.enum(['verified_caller_id', 'twilio_purchased'])

export const PhoneNumberSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  phone_number: z.string().regex(/^\+[1-9]\d{1,14}$/),
  phone_number_type: PhoneNumberTypeEnum.default('verified_caller_id'),
  outgoing_caller_id_sid: z.string().nullable().optional(),
  twilio_phone_number_sid: z.string().nullable().optional(),
  twilio_subaccount_sid: z.string().nullable().optional(),
  verification_status: VerificationStatusEnum.default('pending'),
  validation_code: z.string().nullable().optional(),
  call_sid: z.string().nullable().optional(),
  friendly_name: z.string().nullable().optional(),
})

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>
export type VerificationStatus = z.infer<typeof VerificationStatusEnum>
export type PhoneNumberType = z.infer<typeof PhoneNumberTypeEnum>
