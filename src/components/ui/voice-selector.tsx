"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Voice } from '@/lib/services/VoiceService';
import { useVoices } from '@/hooks/useVoices';
import WaveSurfer from 'wavesurfer.js';
import { TTSProvidersEnum } from '@/lib/models/agent';
import { z } from 'zod';

interface VoiceSelectorProps {
  selectedVoiceId?: string | null;
  onVoiceSelect: (voiceId: string, provider: z.infer<typeof TTSProvidersEnum>) => void;
  className?: string;
} 

interface AudioPlayerProps {
  previewUrl: string | null;
  voiceId: string;
  currentPlayingId: string | null;
  onPlayStateChange: (voiceId: string | null) => void;
}

function AudioPlayer({ previewUrl, voiceId, currentPlayingId, onPlayStateChange }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isPlaying = currentPlayingId === voiceId;

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || !previewUrl) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'hsl(var(--muted-foreground))',
      progressColor: 'hsl(var(--primary))',
      cursorColor: 'hsl(var(--primary))',
      barWidth: 2,
      barRadius: 1,
      height: 32,
      normalize: true,
      backend: 'WebAudio',
      mediaControls: false,
    });

    wavesurferRef.current = wavesurfer;

    // Load the audio
    setIsLoading(true);
    wavesurfer.load(previewUrl);

    // Event listeners
    wavesurfer.on('ready', () => {
      setIsLoading(false);
      setIsReady(true);
    });

    wavesurfer.on('finish', () => {
      onPlayStateChange(null);
    });

    wavesurfer.on('error', () => {
      setIsLoading(false);
      setIsReady(false);
      onPlayStateChange(null);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [previewUrl, voiceId, onPlayStateChange]);

  // Handle play/pause state changes
  useEffect(() => {
    const wavesurfer = wavesurferRef.current;
    if (!wavesurfer || !isReady) return;

    if (isPlaying) {
      wavesurfer.play().catch(() => {
        onPlayStateChange(null);
      });
    } else {
      wavesurfer.pause();
    }
  }, [isPlaying, isReady, onPlayStateChange]);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPlayStateChange(null);
    } else {
      onPlayStateChange(voiceId);
    }
  };

  if (!previewUrl) {
    return (
      <div className="flex items-center gap-2 w-full">
        <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0 flex-shrink-0">
          <Volume2 className="h-4 w-4 opacity-50" />
        </Button>
        <div className="flex-1 h-8 bg-muted rounded flex items-center justify-center">
          <span className="text-xs text-muted-foreground">No preview</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlayPause}
        disabled={isLoading || !isReady}
        className="h-8 w-8 p-0 hover:bg-primary/10 flex-shrink-0"
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <div ref={waveformRef} className="flex-1 min-w-0" />
    </div>
  );
}

function VoiceCard({ voice, isSelected, onSelect, currentPlayingId, onPlayStateChange }: {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voiceId: string, provider: z.infer<typeof TTSProvidersEnum>) => void;
  currentPlayingId: string | null;
  onPlayStateChange: (voiceId: string | null) => void;
}) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary shadow-md"
      )}
      onClick={() => onSelect(voice.id, voice.provider)}
    >
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold truncate">
              {voice.name || voice.voice_id}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {voice.provider}
            </Badge>
          </div>
          <AudioPlayer
            previewUrl={voice.preview_url}
            voiceId={voice.id}
            currentPlayingId={currentPlayingId}
            onPlayStateChange={onPlayStateChange}
          />
        </div>
      </CardHeader>
      {voice.description && (
        <CardContent className="pt-0">
          <CardDescription className="text-xs line-clamp-2">
            {voice.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
}

function VoiceSkeletonCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

export function VoiceSelector({ selectedVoiceId, onVoiceSelect, className }: VoiceSelectorProps) {
  const { data: voices, isLoading, error } = useVoices();
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  // Group voices by provider
  const voicesByProvider = voices?.reduce((acc, voice) => {
    if (!acc[voice.provider]) {
      acc[voice.provider] = [];
    }
    acc[voice.provider].push(voice);
    return acc;
  }, {} as Record<string, Voice[]>) || {};

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">Failed to load voices. Please try again.</p>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <VoiceSkeletonCard key={i} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Render voices grouped by provider
            Object.entries(voicesByProvider).map(([provider, providerVoices]) => (
              <div key={provider} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground capitalize">
                  {provider}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {providerVoices.map((voice) => (
                    <VoiceCard
                      key={voice.id}
                      voice={voice}
                      isSelected={selectedVoiceId === voice.id}
                      onSelect={onVoiceSelect}
                      currentPlayingId={currentPlayingId}
                      onPlayStateChange={setCurrentPlayingId}
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