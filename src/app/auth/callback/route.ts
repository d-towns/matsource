import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createSupabaseSSRClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Optionally handle X-Forwarded-Host for production behind a proxy
      const forwardedHost = request.headers.get('x-forwarded-host');
      if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }
  // If code is missing or exchange failed, redirect to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
} 