import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const formId = req.nextUrl.searchParams.get('formId')
  if (!formId) {
    return new NextResponse('// Missing formId', {
      status: 400,
      headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
    })
  }

  const supabase = getSupabaseAdminClient()
  // Fetch form record
  const { data: form, error: formErr } = await supabase
    .from('forms')
    .select('id, team_id, is_active, expires_at, metadata')
    .eq('id', formId)
    .single()

  if (formErr || !form || !form.is_active) {
    return new NextResponse('// Form not found or inactive', {
      status: 404,
      headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
    })
  }

  // Check expiration
  if (form.expires_at && new Date(form.expires_at) < new Date()) {
    return new NextResponse('// Form expired', {
      status: 410,
      headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
    })
  }

  // Fetch allowed domains
  const { data: domains } = await supabase
    .from('form_domains')
    .select('domain')
    .eq('form_id', formId)

  const allowedDomains = domains?.map(d => d.domain) || []

  // Validate origin
  const originHeader = req.headers.get('origin') || req.headers.get('referer') || ''
  let host = ''
  try { host = new URL(originHeader).host } catch {}
  if (!allowedDomains.includes(host)) {
    return new NextResponse('// Domain not allowed', {
      status: 403,
      headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
    })
  }

  // Mint token
  const token = jwt.sign(
    { formId, teamId: form.team_id, allowedDomains },
    process.env.WIDGET_JWT_SECRET!,
    { expiresIn: '5m' }
  )

  // Create loader script
  const originUrl = new URL(req.url).origin
  const loaderJs = `
(function(){
  const token = '${token}';
  const iframe = document.createElement('iframe');
  iframe.src = '${originUrl}/api/widget/form?token=' + token;
  iframe.style.border = 'none';
  iframe.width = '100%';
  iframe.height = '${form.metadata?.height || 500}px';
  const s = document.currentScript;
  s.parentNode.insertBefore(iframe, s.nextSibling);
})();
`  

  return new NextResponse(loaderJs, {
    status: 200,
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  })
} 