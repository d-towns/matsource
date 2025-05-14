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
  if (insertErr) {
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
} 