'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BotIcon, PuzzleIcon, BookTextIcon, PhoneIcon, InfoIcon } from 'lucide-react';

interface HelpTopicCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const HelpTopicCard = ({ title, description, href, icon: Icon }: HelpTopicCardProps) => (
  <Link href={href} passHref>
    <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out h-full flex flex-col">
      <CardHeader className="flex-grow">
        <div className="flex items-center mb-3">
          <Icon className="h-8 w-8 mr-3 text-primary" />
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  </Link>
);

export default function HelpPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center mb-10">
        <InfoIcon className="h-10 w-10 mr-4 text-primary" />
        <h1 className="text-4xl font-bold">How It Works</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <HelpTopicCard
          title="Agents"
          description="Understand agent types (Inbound, Outbound, Browser), their capabilities, and how to configure them with scripts and phone numbers."
          href="/workspaces/help/agents"
          icon={BotIcon}
        />
        <HelpTopicCard
          title="Third-Party Integrations"
          description="Learn how to connect with external services like Google Calendar for automated appointment scheduling."
          href="/workspaces/help/integrations"
          icon={PuzzleIcon}
        />
        <HelpTopicCard
          title="Forms & Website Integration"
          description="Discover how to embed forms on your website to capture leads and connect them with your Inbound Voice Agents."
          href="/workspaces/help/forms"
          icon={BookTextIcon}
        />
        <HelpTopicCard
          title="Phone Number Management"
          description="Explore how to purchase and manage phone numbers, including using Twilio subaccounts and setting up verified caller IDs."
          href="/workspaces/help/phone-numbers"
          icon={PhoneIcon}
        />
      </div>
    </div>
  );
} 