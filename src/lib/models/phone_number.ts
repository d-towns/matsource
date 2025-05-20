import { z } from 'zod'

export const PhoneNumberSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  phone_number: z.string().regex(/^\+[1-9]\d{1,14}$/)
})

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>
