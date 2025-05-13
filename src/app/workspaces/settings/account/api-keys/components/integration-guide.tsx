'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface IntegrationGuideProps {
  userId: string;
}

export function IntegrationGuide({ userId }: IntegrationGuideProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Integration Guide</CardTitle>
        <CardDescription>
          Learn how to integrate the lead capture widget on your website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Step 1: Generate a Token</h3>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`curl -X POST https://widget.matsource.com/api/generate-token \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{
    "userId": "${userId || 'your-user-id'}",
    "domains": ["yourdomain.com", "*.yourdomain.com"],
    "expiresInHours": 8760
  }'`}
          </pre>

          <h3 className="font-medium text-lg mt-6">Step 2: Embed the Widget</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add this iframe to your website, replacing YOUR_TOKEN with the token you received in step 1.
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`<iframe
  src="https://widget.matsource.com/widget?token=YOUR_TOKEN"
  width="100%"
  height="450"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
  allow="microphone"
></iframe>`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
} 