// Test script to check available ElevenLabs voices
// Run this in browser console to see which voices work with your API key

const API_KEY = 'sk_18ce8649bd1d25cd36b2744389a4dc7693213bb155174d4a';

// Common free-tier voices
const FREE_VOICES = [
    { name: 'Rachel', id: '21m00Tcm4TlvDq8ikWAM' },
    { name: 'Domi', id: 'AZnzlk1XvdvUeBnXmlld' },
    { name: 'Bella', id: 'EXAVITQu4vr4xnSDxMaL' },
    { name: 'Antoni', id: 'ErXwobaYiN019PkySvjV' },
    { name: 'Elli', id: 'MF3mGyEYCl7XYWbV9V6O' },
    { name: 'Josh', id: 'TxGEqnHWrfWFTfGW9XjX' },
    { name: 'Arnold', id: 'VR6AewLTigWG4xSOukaG' },
    { name: 'Adam', id: 'pNInz6obpgDQGcFmaJgB' },
    { name: 'Sam', id: 'yoZ06aMxZJJ28mfd3POQ' },
];

async function testVoice(voiceId, voiceName) {
    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': API_KEY,
                },
                body: JSON.stringify({
                    text: 'Hello, this is a test.',
                    model_id: 'eleven_monolingual_v1',
                }),
            }
        );

        if (response.ok) {
            console.log(`✅ ${voiceName} (${voiceId}) - WORKS`);
            return true;
        } else {
            console.log(`❌ ${voiceName} (${voiceId}) - ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${voiceName} (${voiceId}) - Error: ${error.message}`);
        return false;
    }
}

async function testAllVoices() {
    console.log('Testing ElevenLabs voices...\n');

    for (const voice of FREE_VOICES) {
        await testVoice(voice.id, voice.name);
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\nTest complete!');
}

// Run the test
testAllVoices();
