'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookTextIcon, ArrowLeft, ExternalLinkIcon } from 'lucide-react';
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

export default function FormsHelpPage() {
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
        <BookTextIcon className="h-10 w-10 md:h-12 md:w-12 mr-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold font-sans">Forms & Website Integration</h1>
      </div>

      <HelpDetailSection>
        <p className="text-base md:text-lg mb-6">
          Integrate BlueAgent directly into your website using our embeddable forms. This is a powerful way to capture leads and provide immediate AI-powered assistance to your website visitors.
        </p>
        
        <h3 className="text-xl font-semibold font-sans mt-6 mb-3">How it Works</h3>
        <p className="mb-4 text-base">
          The process involves generating an embed code within BlueAgent and then placing that code onto your website pages:
        </p>
        <ol className="list-decimal space-y-3 pl-5 mb-4 text-base">
          <li>
            <h4 className="text-lg font-semibold font-sans mb-1">Generate Embed Code</h4> 
            Navigate to the <Link href="/workspaces/integrations/embed" className="text-primary hover:underline">Website Integration <ExternalLinkIcon className="inline-block h-4 w-4 ml-1" /></Link> (often referred to as &quot;Forms&quot;) section in your workspace. Here, you&apos;ll find tools to generate an HTML code snippet for your form/widget.
          </li>
          <li>
            <h4 className="text-lg font-semibold font-sans mb-1">Customize Your Form/Widget</h4> 
            Assign a name to your form for easy identification within BlueAgent. Most importantly, link it to one of your existing Inbound Voice Agents. This selected agent will be responsible for handling all interactions initiated through this specific form.
          </li>
          <li>
            <h4 className="text-lg font-semibold font-sans mb-1">Domain Security</h4> 
            To ensure your form is only used on your approved websites, you can specify which domains are allowed to host it. This is a crucial security measure to prevent unauthorized use of your agent and resources.
          </li>
          <li>
            <h4 className="text-lg font-semibold font-sans mb-1">Embed on Your Site</h4> 
            Once configured, copy the generated embed code. Paste this snippet into the HTML of your website where you want the form or widget to appear (e.g., contact page, landing page footer, or a dedicated support section).
          </li>
        </ol>
        
        <h3 className="text-xl font-semibold font-sans mt-6 mb-3">Visitor Interaction</h3>
        <p className="text-base">
          When a visitor fills out and submits this form on your website, the linked Inbound Voice Agent will automatically be triggered. It will then initiate the conversation or actions defined in its script, providing instant engagement with your potential customers, capturing lead information, or offering support.
        </p>
      </HelpDetailSection>
    </div>
  );
} 