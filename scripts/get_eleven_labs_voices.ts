import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'
dotenv.config();

interface ElevenLabsVoice {
    voice_id: string;
    name: string;
    samples: any[];
    category: string;
    fine_tuning: any;
    labels: any;
    description: string;
    preview_url: string;
    available_for_tiers: any[];
    settings: any;
    sharing: any;
    high_quality_base_model_ids: string[];
    verified_languages: any[];
    safety_control: any;
    voice_verification: any;
    permission_on_resource: string;
    is_owner: boolean;
    is_legacy: boolean;
    is_mixed: boolean;
    created_at_unix: number;
}

interface ElevenLabsResponse {
    voices: ElevenLabsVoice[];
}

const getElevenLabsVoices = async () => {
    try {
        // Fetch voices from ElevenLabs API
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY!
            }
        });

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
        }

        const data: ElevenLabsResponse = await response.json();
        console.log(`Found ${data.voices.length} voices from ElevenLabs`);

        // Get Supabase admin client
        const env = process.env.NEXT_PUBLIC_NODE_ENV
        let supabase = null
        if(env === 'production') {
            supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        } else {
            supabase = createClient(process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!, process.env.NEXT_PUBLIC_DEV_SUPABASE_SERVICE_ROLE_KEY!);
        }

        if (!supabase) {
            console.error('Supabase client not initialized');
            process.exit(1);
        }

        // Prepare voice data for insertion
        const voicesToInsert = data.voices.map(voice => ({
            provider: 'elevenlabs' as const,
            voice_id: voice.voice_id,
            description: voice.description,
            preview_url: voice.preview_url,
            name: voice.name
        }));

        // Insert voices into the database (using upsert to handle duplicates)
        const { data: insertedVoices, error } = await supabase
            .from('voices')
            .upsert(voicesToInsert, {
                onConflict: 'provider,voice_id',
                ignoreDuplicates: false
            })
            .select();

        if (error) {
            console.error('Error inserting voices:', error);
            throw error;
        }

        console.log(`Successfully inserted/updated ${insertedVoices?.length || 0} voices`);
        console.log('Voices inserted:', insertedVoices);

    } catch (error) {
        console.error('Error fetching or inserting ElevenLabs voices:', error);
        process.exit(1);
    }
};

getElevenLabsVoices();
