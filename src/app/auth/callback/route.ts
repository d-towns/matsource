import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Check if this is a new user who needs a team
      if (next.includes('/onboarding')) {
        try {
          const adminSupabase = getSupabaseAdminClient();
          
          // Check if user already has a team via user_teams table
          const { data: existingUserTeam } = await adminSupabase
            .from('user_teams')
            .select('team_id')
            .eq('user_id', data.user.id)
            .single();

          if (!existingUserTeam?.team_id) {
            // Create new team for OAuth user
            const full_name = data.user.user_metadata?.full_name || 
                             data.user.email?.split('@')[0] || 
                             'User';
            
            const { data: team, error: teamError } = await adminSupabase
              .from('teams')
              .insert({
                name: `${full_name}'s Team`,
                description: 'New team',
                onboarding_step: 'plan_selection'
              })
              .select()
              .single();

            if (!teamError && team) {
              // Create user_teams record to associate user with team
              await adminSupabase
                .from('user_teams')
                .insert({
                  user_id: data.user.id,
                  team_id: team.id,
                  role: 'owner'
                });
            }
          }
        } catch (error) {
          console.error('Error creating team for OAuth user:', error);
          // Continue with redirect even if team creation fails
        }
      }

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