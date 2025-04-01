'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplet, PlugZap, CarFront, House } from 'lucide-react';
import { Separator } from './ui/separator';
// Audio file mapping for different business types
const BUSINESS_AUDIO_MAP = {
  plumbing: {
    label: 'Plumbing',
    audioFile: '/audio/plumbing-test.wav',
    icon: Droplet,
    integrationsUsed: [
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Get available timeslots'
      },
      
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Create appointments'
      },
    ]
  },
  electrician: {
    label: 'Electrician',
    audioFile: '/audio/electrician-test.wav',
    icon: PlugZap,
    integrationsUsed: [
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Get available timeslots'
      },
      
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Create appointments'
      },

      {
        name: 'Hubspot',
        icon: '/logos/hubspot.png',
        description: 'Create a new customer in your CRM'
      }
    ]
  },
  roofing: {
    label: 'Roofing',
    audioFile: '/audio/roofing-test.wav',
    icon: House,
    integrationsUsed: [
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Get available timeslots'
      },
      {
        name: 'Hubspot',
        icon: '/logos/hubspot.png',
        description: 'Create a new customer in your CRM'
      },
      {
        name: 'Jobber',
        icon: '/logos/jobber.png',
        description: 'Create a new job in your Jobber'
      }
    ]
  },
  autoService: {
    label: 'Auto',
    audioFile: '/audio/auto-service-test.wav',
    icon: CarFront,
    integrationsUsed: [
      {
        name: 'Google Calendar',
        icon: '/logos/google-calendar.png',
        description: 'Get available timeslots'
      },
      {
        name: 'Hubspot',
        icon: '/logos/hubspot.png',
        description: 'Create a new customer in your CRM'
      },
      {
        name: 'Jobber',
        icon: '/logos/jobber.png',
        description: 'Create a new job in your Jobber'
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">


        <div className="flex gap-6">
          {/* Waveform and controls */}


          <div className="flex-1">
            <div
              ref={waveformRef}
              className="w-full mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
            />
            {/* show integrations used */}
            <div className="flex flex-row  gap-4">
              {BUSINESS_AUDIO_MAP[currentBusiness].integrationsUsed.map((integration) => (
                <div key={integration.name} className="flex  items-center gap-2 w-[150px] border border-gray-200 rounded-lg p-2">
                  <div className="flex flex-col items-center gap-2">
                    <img src={integration.icon} alt={integration.name} className="w-4 h-4" />
                    <p className=" text-gray-500 text-xs text-center">{integration.name}</p>
                  </div>
                  <Separator className="" orientation='vertical' />
                  <p className="text-xs text-gray-500 text-center">{integration.description}</p>

                </div>
              ))}
            </div>

          </div>
          {/* Business type selector */}
          <div className="w-48 space-y-2 mb-2 flex flex-col justify-between">
            <div>
            <h3 className="font-sans font-semibold text-lg mb-4 text-center">Business Type</h3>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {Object.entries(BUSINESS_AUDIO_MAP).map(([type, data]) => (
                <Button
                  key={type}
                  onClick={() => changeBusiness(type as BusinessType)}
                  variant={currentBusiness === type ? "default" : "outline"}
                  className="w-full p-8"
                >
                  <div className="flex flex-col items-center gap-2">
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
                className="min-w-[100px]"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>
          </div>

        </div>

      </Card>
    </div>
  );
} 