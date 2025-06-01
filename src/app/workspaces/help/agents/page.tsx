'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BotIcon, ArrowLeft } from 'lucide-react';
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

export default function AgentsHelpPage() {
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
        <BotIcon className="h-10 w-10 md:h-12 md:w-12 mr-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold font-sans">Understanding Agents</h1>
      </div>

      <HelpDetailSection>
        <p className="text-base md:text-lg mb-6">
          Agents are your AI-powered assistants in BlueAgent. They can be configured to handle various tasks based on their type and script.
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-semibold font-sans text-left hover:no-underline">
              Agent Types
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <p className="mb-4 text-base">
                BlueAgent offers three main types of agents, each tailored for specific interaction scenarios:
              </p>
              <ul className="space-y-3 list-disc pl-5 mb-4">
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Inbound Voice Agents</h4>
                  <p className="text-base">
                    These agents handle incoming calls. They are typically linked to a phone number and can also be integrated with website forms. When a user submits a form on your website, an Inbound Voice Agent can initiate an interaction.
                  </p>
                </li>
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Outbound Voice Agents</h4>
                  <p className="text-base">
                    Designed for making outgoing calls. You can assign them to calling campaigns, and they will use their script to interact with leads or customers.
                  </p>
                </li>
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Browser Agents</h4>
                  <p className="text-base">
                    These agents operate within a browser environment, potentially for tasks like automated data entry or website navigation. Their specific capabilities depend on the scripts and workflows you define.
                  </p>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-semibold font-sans text-left hover:no-underline">
              Key Agent Features
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <p className="mb-4 text-base">
                To effectively utilize agents, understand these core features:
              </p>
              <ul className="space-y-3 list-disc pl-5 mb-4">
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Scripts</h4>
                  <p className="text-base">
                    Define the conversation flow or tasks your agent will follow. This is where you customize the agent&apos;s behavior, responses, and decision-making logic.
                  </p>
                </li>
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Phone Numbers</h4>
                  <p className="text-base">
                    Assign dedicated phone numbers to your voice agents for inbound or outbound calls. For outbound calls, ensure you use a verified Caller ID to improve answer rates and maintain professionalism.
                  </p>
                </li>
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Team Association</h4>
                  <p className="text-base">
                    Agents are organized within teams. This structure helps in managing access, collaboration, and viewing performance data related to specific groups of agents or campaigns.
                  </p>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </HelpDetailSection>
    </div>
  );
} 