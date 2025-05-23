'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplet, PlugZap, CarFront, House} from 'lucide-react';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
// Audio file mapping for different business types

interface Business {
  label: string;
  audioFile: string;
  icon: React.ElementType;
  integrationsUsed: Integration[];
}

interface Integration {
  name: string;
  icon: string;
  description: string;
  slug: string;
}
const BUSINESS_AUDIO_MAP : Record<string, Business> = {
  plumbing: {
    label: 'Plumbing',
    audioFile: 'https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/test-audio//plumbing-test.wav',
    icon: Droplet,
    integrationsUsed: [
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Get available timeslots',
        slug: 'google-calendar-timeslots'
      },

      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Create events',
        slug: 'google-calendar-events'
      },
      {
        name: 'ServiceTitan',
        icon: '/logos/service-titan.png',
        description: 'Create and assign a new job',
        slug: 'service-titan-jobs'
      }
    ]
  },
  electrician: {
    label: 'Electrician',
    audioFile: 'https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/test-audio//electrician-test.wav',
    icon: PlugZap,
    integrationsUsed: [
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Get available timeslots',
        slug: 'google-calendar-timeslots'
      },

      {
        name: 'HouseCall Pro',
        icon: '/logos/housecall.webp',
        description: 'Create and assign a new job',
        slug: 'housecall-pro-jobs'
      },

      {
        name: 'Hubspot',
        icon: '/logos/hubspot.png',
        description: 'Create a new customer in your CRM',
        slug: 'hubspot-customers'
      }
    ]
  },
  roofing: {
    label: 'Roofing',
    audioFile: 'https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/test-audio//roofing-test.wav',
    icon: House,
    integrationsUsed: [
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Get available timeslots',
        slug: 'google-calendar-timeslots'
      },
      {
        name: 'Hubspot',
        icon: '/logos/hubspot.png',
        description: 'Create a new customer in your CRM',
        slug: 'hubspot-customers'
      },
      {
        name: 'Jobber',
        icon: '/logos/jobber.png',
        description: 'Create a new job in your Jobber',
        slug: 'jobber-jobs'
      }
    ]
  },
  autoService: {
    label: 'Auto',
    audioFile: 'https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/test-audio//auto-service-test.wav',
    icon: CarFront,
    integrationsUsed: [
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Get available timeslots',
        slug: 'google-calendar-timeslots'
      },
      {
        name: 'Hubspot',
        icon: '/logos/hubspot.png',
        description: 'Create a new customer in your CRM',
        slug: 'hubspot-customers'
      },
      {
        name: 'Jobber',
        icon: '/logos/jobber.png',
        description: 'Create a new job in your Jobber',
        slug: 'jobber-jobs'
        }
      ]
  }
} as const;

type BusinessType = keyof typeof BUSINESS_AUDIO_MAP;

export function AudioPlayer() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessType>('plumbing');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4F4A85',
      progressColor: '#383351',
      height: 200,
      cursorWidth: 2,
      cursorColor: '#383351',
      barWidth: 3,
      normalize: true,
      url: BUSINESS_AUDIO_MAP[currentBusiness].audioFile,
    });

    wavesurferRef.current = wavesurfer;

    // Event listeners
    wavesurfer.on('finish', () => setIsPlaying(false));
    wavesurfer.on('ready', () => {
      console.log('WaveSurfer is ready');
      setIsLoading(false);
    });
    wavesurfer.on('load', () => {
      setIsLoading(true);
    });
    wavesurfer.on('error', (err) => {
      console.error('WaveSurfer error:', err);
    });

    // Cleanup
    return () => {
      wavesurfer.destroy();
    };
  }, [currentBusiness]);

  const togglePlayPause = () => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeBusiness = (type: BusinessType) => {
    setIsPlaying(false);
    setCurrentBusiness(type);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <div className={`flex flex-col md:flex-row gap-6 h-full`}>
          {/* Business type selector - Now on left/top */}
          <div className="w-full md:w-48 space-y-2 mb-2 flex flex-col justify-between">
            <div>
              <h3 className="font-sans font-semibold text-xl mb-4 text-center">Select Your Business</h3>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {Object.entries(BUSINESS_AUDIO_MAP).map(([type, data]) => (
                  <Button
                    key={type}
                    onClick={() => changeBusiness(type as BusinessType)}
                    variant={currentBusiness === type ? "default" : "outline"}
                    className="w-full p-10"
                  >
                    <div className="flex flex-col items-center gap-2 ">
                      <data.icon className="w-6 h-6" />
                      {data.label}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-4 mb-8">
              <Button
                onClick={togglePlayPause}
                disabled={isLoading}
                className="w-full p-8 md:text-2xl text-lg"
              >
                {isPlaying ? 'Pause' : 'Play Audio'}
              </Button>
            </div>
          </div>

          <div className="hidden md:block">
            <Separator className="h-full" orientation='vertical' />
          </div>
          <div className="block md:hidden">
            <Separator className="w-full" orientation='horizontal' />
          </div>

          {/* Waveform and integrations */}
          <div className="flex-1">
            <div
              ref={waveformRef}
              className={`w-full mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg ${isLoading ? 'hidden' : ''}`}
            />
            {isLoading && (
              <div>
                <Skeleton className="w-full h-48 w-full mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg" />
              </div>
            )}

            {/* show integrations used */}
            <h3 className="font-sans font-semibold text-lg mb-4 text-center">During this call, the agent used these tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BUSINESS_AUDIO_MAP[currentBusiness].integrationsUsed.map((integration) => (
                <div key={integration.slug} className="flex flex-col md:flex-row items-center justify-center gap-2 w-full border border-gray-200 rounded-lg p-2">
                  <div className="flex flex-col items-center gap-2">
                    <Image src={integration.icon} alt={integration.name} className="max-w-12 max-h-12" width={48} height={48} />
                    <p className="text-gray-500 text-xs text-center md:block hidden font-semibold">{integration.name}</p>
                  </div>
                  <div className='hidden md:block h-full'>
                  <Separator className="h-full" orientation="vertical" />
                  </div>
                  <div className='block md:hidden w-full'>
                    <Separator className="w-full" orientation="horizontal" />
                  </div>
                  <p className="md:text-base text-xs text-gray-500 text-center">{integration.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 