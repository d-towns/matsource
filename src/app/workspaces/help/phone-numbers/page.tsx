'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PhoneIcon, ArrowLeft, ExternalLinkIcon } from 'lucide-react';
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

export default function PhoneNumbersHelpPage() {
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
        <PhoneIcon className="h-10 w-10 md:h-12 md:w-12 mr-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold font-sans">Phone Number Management</h1>
      </div>

      <HelpDetailSection>
        <p className="text-base md:text-lg mb-6">
          Proper phone number management is crucial for effective voice communications in BlueAgent. This includes how numbers are provisioned via Twilio subaccounts, how new numbers might be acquired, and critically, how to verify your existing phone numbers for use as Caller IDs in outbound calls.
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-semibold font-sans text-left hover:no-underline">
              Twilio Subaccounts: The Backbone
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <p className="mb-4 text-base">
                For each team created within BlueAgent, a dedicated Twilio subaccount is automatically provisioned behind the scenes. You generally don&apos;t need to interact with these subaccounts directly; BlueAgent handles their creation and management. This approach offers several benefits:
              </p>
              <ul className="space-y-3 list-disc pl-5 mb-4 text-base">
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Isolation & Organization</h4>
                  <p className="text-base">Keeps phone numbers, call logs, and potentially billing separate for each team, making management and reporting cleaner and more organized.</p>
                </li>
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Enhanced Security</h4>
                  <p className="text-base">Limits the scope of API credentials to a specific team&apos;s resources, enhancing the overall security of your telephony operations.</p>
                </li>
                <li>
                  <h4 className="text-lg font-semibold font-sans mb-1">Scalability Support</h4>
                  <p className="text-base">Allows for easier scaling of telephony resources as your organization grows and adds more teams or services.</p>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-semibold font-sans text-left hover:no-underline">
              Acquiring New Phone Numbers
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <p className="mb-4 text-base">
                BlueAgent, through its deep integration with Twilio, has the capability to search for and acquire new phone numbers for your team&apos;s subaccount (e.g., based on area code or other criteria).
              </p>
              <p className="text-base">
                While the primary user interface under <Link href="/workspaces/phone-numbers" className="text-primary hover:underline">Phone Numbers <ExternalLinkIcon className="inline-block h-4 w-4 ml-1" /></Link> focuses on verifying *existing* numbers for caller ID, the underlying system can provision new ones. If you need new phone numbers for your agents (e.g., for specific campaigns, local presence, or unique tracking), this may be handled via an administrative process or a dedicated interface not covered in the standard user flow. Please consult your account administrator or BlueAgent support for details on requesting new numbers.
              </p>
              <p className="mt-3 text-base">
                Purchased numbers are automatically configured with the necessary voice URLs to work seamlessly with your BlueAgent voice agents.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-semibold font-sans text-left hover:no-underline">
              Verifying Your Existing Phone Numbers for Caller ID
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <p className="mb-4 text-base">
                To improve call answer rates and maintain a professional appearance for your outbound calls, it&apos;s essential to use verified Caller IDs. This tells recipients who is calling and builds trust.
              </p>
              <h4 className="text-lg font-semibold font-sans mb-2">The Verification Process:</h4>
              <ol className="list-decimal space-y-3 pl-5 mb-4 text-base">
                <li>
                  <strong>Add Existing Number:</strong> Navigate to the <Link href="/workspaces/phone-numbers/new" className="text-primary hover:underline">Add Phone Number <ExternalLinkIcon className="inline-block h-4 w-4 ml-1" /></Link> page (usually accessible from the main &quot;Phone Numbers&quot; screen). You will be prompted to enter the phone number you own and wish to verify, along with a friendly name for identification.
                </li>
                <li>
                  <strong>Automated Verification Call:</strong> Once you submit the number, Twilio (orchestrated by BlueAgent) will place an automated call to the phone number you provided. This call will announce a unique verification code.
                </li>
                <li>
                  <strong>Confirmation Step:</strong> You (or the person who has access to the phone number) will need to listen for this code. The exact method for entering or confirming the code might vary (e.g., entering it into a field in BlueAgent if prompted, or simply acknowledging the call as per Twilio&apos;s specific verification flow at the time).
                </li>
                <li>
                  <strong>Status Update & Usage:</strong> Twilio then sends a callback to BlueAgent with the outcome (e.g., &apos;success&apos; or &apos;failed&apos;). Once successfully verified, this number becomes available in your list of verified Caller IDs and can be selected when configuring your outbound voice agents.
                </li>
              </ol>
              <p className="text-base">
                Using verified caller IDs helps prevent your calls from being incorrectly flagged as spam and significantly increases the likelihood of your leads and customers answering your calls.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </HelpDetailSection>
    </div>
  );
} 