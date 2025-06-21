"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Model } from '@/lib/services/ModelService';
import { useModels } from '@/hooks/useModels';
import { LLMProvidersEnum } from '@/lib/models/agent';
import { z } from 'zod';

interface ModelSelectorProps {
  selectedModelId?: string | null;
  onModelSelect: (modelId: string, provider: z.infer<typeof LLMProvidersEnum>) => void;
  className?: string;
}

function ModelCard({ model, isSelected, onSelect }: {
  model: Model;
  isSelected: boolean;
  onSelect: (modelId: string, provider: z.infer<typeof LLMProvidersEnum>) => void;
}) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary shadow-md"
      )}
      onClick={() => onSelect(model.id, model.provider)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {model.name || model.model_name}
            </CardTitle>
            {model.description && (
              <CardDescription className="text-sm mt-1 line-clamp-2">
                {model.description}
              </CardDescription>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {model.provider}
              </Badge>
              <Badge 
                variant={model.tier === 'premium' ? 'default' : 'secondary'} 
                className={cn(
                  "text-xs",
                  model.tier === 'premium' && "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                )}
              >
                {model.tier === 'premium' && <Crown className="h-3 w-3 mr-1" />}
                {model.tier}
              </Badge>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </div>
            {!model.name && (
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {model.model_name}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function ModelSkeletonCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function ModelSelector({ selectedModelId, onModelSelect, className }: ModelSelectorProps) {
  const { data: models, isLoading, error } = useModels();

  // Group models by provider and sort by tier (premium first)
  const modelsByProvider = models?.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, Model[]>) || {};

  // Sort models within each provider group (premium first, then by name)
  Object.keys(modelsByProvider).forEach(provider => {
    modelsByProvider[provider].sort((a, b) => {
      // Premium models first
      if (a.tier === 'premium' && b.tier === 'basic') return -1;
      if (a.tier === 'basic' && b.tier === 'premium') return 1;
      // Then sort by name (or model_name if no name)
      const aName = a.name || a.model_name;
      const bName = b.name || b.model_name;
      return aName.localeCompare(bName);
    });
  });

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">Failed to load models. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4 p-1">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <ModelSkeletonCard key={i} />
            ))
          ) : (
            // Render models grouped by provider
            Object.entries(modelsByProvider).map(([provider, providerModels]) => (
              <div key={provider} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground capitalize">
                  {provider}
                </h4>
                <div className="grid gap-2">
                  {providerModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isSelected={selectedModelId === model.id}
                      onSelect={onModelSelect}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 