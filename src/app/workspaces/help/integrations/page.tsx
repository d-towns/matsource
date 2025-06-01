'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PuzzleIcon, ArrowLeft, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

const HelpDetailSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <Card className="mb-8 shadow-sm">
    {title && (
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold font-sans">{title}</CardTitle>
      </CardHeader>
    )}
    <CardContent className="prose prose-sm sm:prose-base lg:prose-lg max-w-none p-6 pt-4 font-sans">
      {children}
    </CardContent>
  </Card>
);

export default function IntegrationsHelpPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Link 
        href="/workspaces/help" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 font-sans"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Help Center
      </Link>
      <div className="flex items-center mb-10">
        <PuzzleIcon className="h-10 w-10 md:h-12 md:w-12 mr-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold font-sans">Third-Party Integrations</h1>
      </div>

      <HelpDetailSection title="Google Calendar Integration">
        <p className="text-base md:text-lg mb-4">
          BlueAgent allows you to connect with third-party services to extend its functionality. Currently, we offer integration with Google Calendar to streamline your appointment scheduling.
        </p>
        
        <h3 className="text-xl font-semibold font-sans mt-6 mb-3">Connecting Google Calendar</h3>
        <p className="mb-4 text-base">
          Follow these steps to link your Google Calendar with BlueAgent:
        </p>
        <ol className="list-decimal space-y-2 pl-5 mb-4 text-base">
          <li>
            Navigate to the <Link href="/workspaces/integrations" className="text-primary hover:underline">Integrations page <ExternalLinkIcon className="inline-block h-4 w-4 ml-1" /></Link> within your workspace settings.
          </li>
          <li>
            Look for the Google Calendar option and click the &quot;Connect&quot; button.
          </li>
          <li>
            You will be redirected to Google&apos;s authentication page. Sign in to your Google account if prompted.
          </li>
          <li>
            Grant BlueAgent the necessary permissions to access your calendar. This typically includes viewing calendars and creating/editing events.
          </li>
          <li>
            Once authorized, you will be redirected back to BlueAgent, and the connection should be active.
          </li>
        </ol>
        
        <h3 className="text-xl font-semibold font-sans mt-6 mb-3">Benefits of Integration</h3>
        <p className="text-base">
          Once connected, BlueAgent can automatically schedule appointments with leads based on your availability as reflected in your Google Calendar. This helps to:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-base">
          <li>Reduce manual effort in booking appointments.</li>
          <li>Avoid double-bookings and scheduling conflicts.</li>
          <li>Ensure your calendar is always up-to-date with new bookings made by your agents.</li>
        </ul>
      </HelpDetailSection>
      {/* Add other integrations here as they become available */}
    </div>
  );
} 