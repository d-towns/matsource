import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { LeadService } from '@/lib/services/LeadService'

interface WidgetLeadPayload {
  allowedDomains: string[];
  teamId: string;
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 })
  }

  let payload: WidgetLeadPayload
  try {
    payload = jwt.verify(token, process.env.WIDGET_JWT_SECRET!) as WidgetLeadPayload
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
  }

  // Validate origin
  const originHeader = req.headers.get('origin') || req.headers.get('referer') || ''
  let host = ''
  try { host = new URL(originHeader).host } catch {}
  if (!payload.allowedDomains.includes(host)) {
    return NextResponse.json({ success: false, error: 'Domain not allowed' }, { status: 403 })
  }

  // Parse request body
  const body = await req.json()
  const { name, phone, email, source, notes } = body

  try {
    const lead = await LeadService.createLead(
      { name, phone, email, source, notes },
      payload.teamId
    )
    return NextResponse.json({ success: true, lead })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
} 