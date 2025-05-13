import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

interface WidgetFormPayload {
  allowedDomains: string[];
  formId: string;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return new NextResponse('Missing token', { status: 400 })
  }

  let payload: WidgetFormPayload
  try {
    payload = jwt.verify(token, process.env.WIDGET_JWT_SECRET!) as WidgetFormPayload
  } catch {
    return new NextResponse('Invalid or expired token', { status: 401 })
  }

  // Validate origin
  const originHeader = req.headers.get('origin') || req.headers.get('referer') || ''
  let host = ''
  try { host = new URL(originHeader).host } catch {}
  if (!payload.allowedDomains.includes(host)) {
    return new NextResponse('Domain not allowed', { status: 403 })
  }

  // Fetch embed_code and metadata
  const supabase = getSupabaseAdminClient()
  const { data: form, error } = await supabase
    .from('forms')
    .select('embed_code, metadata')
    .eq('id', payload.formId)
    .single()

  if (error || !form) {
    return new NextResponse('Form not found', { status: 404 })
  }

  const csp = `frame-ancestors 'self' ${payload.allowedDomains.join(' ')}`
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    /* Your widget styles here or load from external CSS */
  </style>
</head>
<body>
  ${form.embed_code}
  <script>
    window.widgetToken = '${token}';
  </script>
  <script src="/widget.js"></script>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': csp,
    },
  })
} 