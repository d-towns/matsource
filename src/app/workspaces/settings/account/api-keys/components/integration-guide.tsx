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
{`curl -X POST https://matbot.com/api/generate-token \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "userId": "${userId || 'your-user-id'}",
    "domains": ["yourdomain.com", "*.yourdomain.com"],
    "expiresInHours": 8760
  }'`}
          </pre>

          <h3 className="font-medium text-lg mt-6">Step 2: Embed the Widget</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add this script tag to your website, replacing <code>YOUR_FORM_ID</code> with the form ID you received in step 1.
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`<script src="https://matbot.com/loader.js" data-form-id="YOUR_FORM_ID"></script>`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
} 