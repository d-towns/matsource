import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

async function getAllowedOrigin(req: NextRequest, formId: string): Promise<string | null> {
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
    console.log('domain', domain);
    console.log('originHost', originHost);
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
  const formId = req.nextUrl.searchParams.get('formId');
  if (!formId) return new NextResponse(null, { status: 400 });
  const allowedOrigin = await getAllowedOrigin(req, formId);
  if (!allowedOrigin) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const formId = req.nextUrl.searchParams.get('formId')
    if (!formId) {
      return NextResponse.json({ error: '[BlueAgent Widget] Missing formId' }, { status: 400 })
    }
    const allowedOrigin = await getAllowedOrigin(req, formId);
    if (!allowedOrigin) {
      return NextResponse.json({ error: '[BlueAgent Widget] Origin not allowed' }, { status: 403 });
    }

    const supabase = getSupabaseAdminClient()
    // Fetch form record
    const { data: form, error: formErr } = await supabase
      .from('forms')
      .select('id, team_id, is_active, expires_at, metadata')
      .eq('id', formId)
      .single()

    if (formErr || !form || !form.is_active) {
      return NextResponse.json({ error: '[BlueAgent Widget] Form not found or inactive' }, { status: 404, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
    }

    // Check expiration
    if (form.expires_at && new Date(form.expires_at) < new Date()) {
      return NextResponse.json({ error: '[BlueAgent Widget] Form expired' }, { status: 410, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
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
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (err) {
    console.error('Error in /api/widget/init:', err);
    return NextResponse.json(
      { error: '[BlueAgent Widget] Internal Server Error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
} 