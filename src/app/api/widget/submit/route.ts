import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { LeadSchema } from '@/lib/models/lead'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

const WidgetLeadSchema = LeadSchema.pick({
  name: true,
  phone: true,
  email: true,
  notes: true,
})

export async function POST(req: NextRequest) {
  // Validate JWT
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
  }
  const token = authHeader.replace('Bearer ', '')
  let payload
  try {
    payload = jwt.verify(token, process.env.WIDGET_JWT_SECRET!)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid or expired token: ' + e }, { status: 401 })
  }

  // Validate allowed domain
  const originHeader = req.headers.get('origin') || req.headers.get('referer') || ''
  let host = ''
  try { host = new URL(originHeader).host } catch {}
  if (!payload.allowedDomains?.includes(host)) {
    return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 })
  }

  // Validate input
  let data
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parse = WidgetLeadSchema.safeParse(data)
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid input', details: parse.error.flatten() }, { status: 400 })
  }

  // Insert lead into Supabase
  const supabase = getSupabaseAdminClient()
  const { error: insertErr } = await supabase.from('leads').insert({
    name: data.name,
    phone: data.phone,
    email: data.email || '',
    notes: data.notes || '',
    form_id: payload.formId,
    team_id: payload.teamId,
    source: 'widget',
    status: 'new',
  })


  const leadData = LeadSchema.parse(data)

  if (insertErr) {
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  const {data: form_agent_id, error: form_agent_id_err} = await supabase.from('forms').select('agent_id').eq('id', payload.formId).single()
  if (form_agent_id_err) {
    return NextResponse.json({ error: 'Failed to get form agent id' }, { status: 500 })
  }

  const {data: phone_number, error: phone_number_err} = await supabase.from('agents').select('phone_number(*)').eq('id', form_agent_id).single()
  if (phone_number_err) {
    return NextResponse.json({ error: 'Failed to get agent phone number' }, { status: 500 })
  }

  const response = await fetch(`${process.env.VOICE_AGENT_SERVICE_URL}/create-outbound-call`, {
    method: 'POST',
    body: JSON.stringify({
        to_number: leadData.phone,
        from_number: phone_number.phone_number,
        team_id: payload.teamId,
        form_id: payload.formId,
        lead_id: leadData.id,
    }),
  })
  console.log('outbound call initiated', response)
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to create outbound call' }, { status: 500 })
  }

  const {data: outboundCall, error: outboundCallErr} = await response.json()
  console.log('outbound call created', outboundCall)
  if (outboundCallErr) {
    return NextResponse.json({ error: 'Failed to create outbound call' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
} 