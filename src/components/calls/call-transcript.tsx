"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserIcon, BotIcon, SettingsIcon } from "lucide-react";

interface TranscriptMessage {
  role?: string;
  content?: string;
  tool_call_id?: string | null;
  tool_calls?: Array<{
    id: string;
    type: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

interface CallTranscriptProps {
  transcript: TranscriptMessage[] | null | undefined;
  leadName: string;
}

export function CallTranscript({ transcript, leadName }: CallTranscriptProps) {
  if (!transcript || transcript.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Call Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No transcript available for this call.</p>
        </CardContent>
      </Card>
    );
  }

  // Filter out system messages and tool messages, but keep assistant messages with tool_calls
  const conversationMessages = transcript.filter(
    (msg) => msg.role && msg.role !== "system" && msg.role !== "tool" && (msg.content || msg.tool_calls)
  );

  if (conversationMessages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Call Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No conversation transcript available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Transcript</CardTitle>
        <Badge variant="outline" className="w-fit">
          {conversationMessages.length} messages
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {conversationMessages.map((message, index) => {
            const isUser = message.role === "user";
            const speaker = isUser ? leadName : "Agent";
            const icon = isUser ? (
              <UserIcon className="h-4 w-4" />
            ) : (
              <BotIcon className="h-4 w-4" />
            );

            return (
              <div key={index} className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{speaker}</span>
                  </div>
                  
                  {/* Regular message content */}
                  {message.content && (
                    <div
                      className={`p-3 rounded-lg text-sm mb-2 ${
                        isUser
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-green-50 border border-green-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  )}
                  
                  {/* Tool calls (function calls) */}
                  {message.tool_calls && message.tool_calls.length > 0 && (
                    <div className="space-y-2">
                      {message.tool_calls.map((toolCall, toolIndex) => (
                        <div
                          key={toolIndex}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <SettingsIcon className="h-3 w-3 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Used tool: {toolCall.function.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 bg-gray-100 rounded p-2 font-mono">
                            {toolCall.function.arguments}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 