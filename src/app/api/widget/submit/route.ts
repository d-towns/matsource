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

async function getAllowedOriginForFormId(req: NextRequest, formId: string): Promise<string | null> {
  const originHeader = req.headers.get('origin') || req.headers.get('referer') || '';
  let originHost = '';
  try { originHost = new URL(originHeader).host; } catch {}
  if (!originHost) return null;

  const supabase = getSupabaseAdminClient();
  const { data: domains } = await supabase
    .from('form_domains')
    .select('domain')
    .eq('form_id', formId);

  if (!domains) return null;

  for (const { domain } of domains) {
    if (domain.startsWith('*.')) {
      const base = domain.slice(2);
      if (originHost === base || originHost.endsWith('.' + base)) return originHeader;
    } else if (originHost === domain) {
      return originHeader;
    }
  }
  return null;
}

export async function OPTIONS(req: NextRequest) {
  // Get formId from query params for CORS check
  const formId = req.nextUrl.searchParams.get('formId');
  if (!formId) return new NextResponse(null, { status: 400 });
  const allowedOrigin = await getAllowedOriginForFormId(req, formId);
  if (!allowedOrigin) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  // Validate JWT
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: '[BlueAgent Widget] Missing or invalid Authorization header' }, { status: 401 })
  }
  const token = authHeader.replace('Bearer ', '')
  let payload
  try {
    payload = jwt.verify(token, process.env.WIDGET_JWT_SECRET!)
  } catch (e) {
    return NextResponse.json({ error: '[BlueAgent Widget] Invalid or expired token: ' + e }, { status: 401 })
  }

  // Validate allowed domain
  const allowedOrigin = await getAllowedOriginForFormId(req, payload.formId);
  if (!allowedOrigin) {
    return NextResponse.json({ error: '[BlueAgent Widget] Origin not allowed' }, { status: 403 });
  }

  // Validate input
  let data
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ error: '[BlueAgent Widget] Invalid JSON' }, { status: 400, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
  }
  const parse = WidgetLeadSchema.safeParse(data)
  if (!parse.success) {
    return NextResponse.json({ error: '[BlueAgent Widget] Invalid input', details: parse.error.flatten() }, { status: 400, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
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
    return NextResponse.json({ error: '[BlueAgent Widget] Failed to save lead' }, { status: 500, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
  }

  const {data: form_agent_id, error: form_agent_id_err} = await supabase.from('forms').select('agent_id').eq('id', payload.formId).single()
  if (form_agent_id_err) {
    return NextResponse.json({ error: '[BlueAgent Widget] Failed to get form agent id' }, { status: 500, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
  }

  const {data: phone_number, error: phone_number_err} = await supabase.from('agents').select('phone_number(*)').eq('id', form_agent_id).single()
  if (phone_number_err) {
    return NextResponse.json({ error: '[BlueAgent Widget] Failed to get agent phone number' }, { status: 500, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
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
    return NextResponse.json({ error: '[BlueAgent Widget] Failed to create outbound call' }, { status: 500, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
  }

  const {data: outboundCall, error: outboundCallErr} = await response.json()
  console.log('outbound call created', outboundCall)
  if (outboundCallErr) {
    return NextResponse.json({ error: '[BlueAgent Widget] Failed to create outbound call' }, { status: 500, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
  }

  return NextResponse.json({ success: true }, { status: 200, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
} 