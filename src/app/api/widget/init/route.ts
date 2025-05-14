import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const formId = req.nextUrl.searchParams.get('formId')
  if (!formId) {
    return NextResponse.json({ error: 'Missing formId' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient()
  // Fetch form record
  const { data: form, error: formErr } = await supabase
    .from('forms')
    .select('id, team_id, is_active, expires_at, metadata')
    .eq('id', formId)
    .single()

  if (formErr || !form || !form.is_active) {
    return NextResponse.json({ error: 'Form not found or inactive' }, { status: 404 })
  }

  // Check expiration
  if (form.expires_at && new Date(form.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Form expired' }, { status: 410 })
  }

  // Fetch allowed domains
  const { data: domains } = await supabase
    .from('form_domains')
    .select('domain')
    .eq('form_id', formId)

  const allowedDomains = domains?.map(d => d.domain) || []

  // Mint token
  const token = jwt.sign(
    { formId, teamId: form.team_id, allowedDomains },
    process.env.WIDGET_JWT_SECRET!,
    { expiresIn: '5m' }
  )

  // Widget config to return
  const formConfig = {
    formId: form.id,
    teamId: form.team_id,
    metadata: form.metadata || {},
    allowedDomains,
  }

  return NextResponse.json({ token, formConfig }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 