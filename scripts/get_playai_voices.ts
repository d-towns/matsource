import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Groq } from 'groq-sdk'
import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config()

const PLAYAI_VOICE_IDS =[
    'Arista-PlayAI',
    'Atlas-PlayAI', 
    'Basil-PlayAI',
    'Briggs-PlayAI',
    'Calum-PlayAI',
    'Celeste-PlayAI',
    'Cheyenne-PlayAI',
    'Chip-PlayAI',
    'Cillian-PlayAI',
    'Deedee-PlayAI',
    'Fritz-PlayAI',
    'Gail-PlayAI',
    'Indigo-PlayAI',
    'Mamaw-PlayAI',
    'Mason-PlayAI',
    'Mikail-PlayAI',
    'Mitch-PlayAI',
    'Quinn-PlayAI',
    'Thunder-PlayAI',
]

const getPlayaiVoices = async () => {
    try {
    const env = process.env.NEXT_PUBLIC_NODE_ENV
    let supabase : SupabaseClient = null
    if(env === 'production') {
        supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    } else {
        supabase = createClient(process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!, process.env.NEXT_PUBLIC_DEV_SUPABASE_SERVICE_ROLE_KEY!)
    }

    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    })

    const {data: voiceDemosBucket, error: voiceDemosBucketError } = await supabase.storage.getBucket('voice-demos')

    if(voiceDemosBucketError) {
        throw voiceDemosBucketError
    }

    if(voiceDemosBucket) {
        console.log(`Voice demos bucket already exists`)
    } else {
        console.log(`Voice demos bucket does not exist, creating...`)
        const { data, error } = await supabase.storage.createBucket('voice-demos')
    }


    for (const voiceId of PLAYAI_VOICE_IDS) {
        const script = `Hi my name is ${voiceId.split('-')[0]}, How can I help you today?`    
        const speechFilePath = `./voices/${voiceId}.wav`;
        const model = "playai-tts";
        const voice = voiceId;
        const text = script;
        const responseFormat = "wav";

        console.log(`Generating ${voiceId}...`)

        const response = await groq.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
            response_format: responseFormat
        })

        const buffer = Buffer.from(await response.arrayBuffer());
        if(!fs.existsSync(path.dirname(speechFilePath))) {
            console.log(`Creating directory ${path.dirname(speechFilePath)}`)
            fs.mkdirSync(path.dirname(speechFilePath), { recursive: true })

        }
        console.log(`Saving ${voiceId} to ${speechFilePath}`)
        await fs.promises.writeFile(speechFilePath, buffer);

        console.log(`Saved ${voiceId} to ${speechFilePath}`)

        console.log(`Uploading ${voiceId} to supabase...`)

        const { data, error } = await supabase.storage.from('voice-demos').upload(speechFilePath.split('/').pop()!, buffer, {
            contentType: 'audio/wav',
            upsert: true
        })
        if(error) {
            throw error
        }

        console.log(`Uploaded ${voiceId} to supabase`)


    }
    } catch (error) {
        console.error(error)
    }
}

const createVoiceRecord = async () => {
    try {
        const env = process.env.NEXT_PUBLIC_NODE_ENV
        let supabase : SupabaseClient = null
        if(env === 'production') {
            supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
        } else {
            supabase = createClient(process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!, process.env.NEXT_PUBLIC_DEV_SUPABASE_SERVICE_ROLE_KEY!)
        }
        await supabase.from('voices').delete().eq('provider', 'playai')
        console.log(`Deleted all playai voices`)
        for (const voiceId of PLAYAI_VOICE_IDS) {
            const { data: {publicUrl} } = supabase.storage.from('voice-demos').getPublicUrl(`${voiceId}.wav`)
            console.log(`Creating voice record for ${voiceId}`)
            const { data, error } = await supabase.from('voices').upsert({
                name: voiceId.split('-')[0],
                voice_id: voiceId,
                provider: 'playai',
                description: `PlayAI voice ${voiceId.split('-')[0]}`,
                preview_url: publicUrl,
            })
            console.log(`Created voice record for ${voiceId}`)
            if(error) {
                throw error
            }

        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

const main = async () => {
    // await getPlayaiVoices()
    await createVoiceRecord()
}

main()