// ElevenLabs Text-to-Speech Service
// Using Rachel voice (Free Tier) - Natural and clear female voice
// Voice ID: 21m00Tcm4TlvDq8ikWAM

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

// Debug: Check if API key is loaded from environment
console.log('🔑 ElevenLabs module loaded');
console.log('🔑 API Key from env:', ELEVENLABS_API_KEY ? `${ELEVENLABS_API_KEY.substring(0, 15)}...` : 'NOT LOADED');
console.log('🔑 Full import.meta.env:', import.meta.env);

class ElevenLabsTTSService {
    constructor() {
        this.apiKey = ELEVENLABS_API_KEY;
        this.voiceId = VOICE_ID;
        this.baseUrl = 'https://api.elevenlabs.io/v1';
        this.audioQueue = [];
        this.isPlaying = false;
        this.currentAudio = null;
    }

    /**
     * Convert text to speech using ElevenLabs API
     * @param {string} text - Text to convert to speech
     * @param {function} onStart - Callback when speech starts
     * @param {function} onEnd - Callback when speech ends
     * @param {function} onError - Callback on error
     */
    async speak(text, { onStart, onEnd, onError } = {}) {
        if (!this.apiKey) {
            console.error('ElevenLabs API key not configured');
            if (onError) onError(new Error('API key not configured'));
            return;
        }

        // Debug: Check if API key is loaded
        console.log('ElevenLabs API Key loaded:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT LOADED');
        console.log('Using voice ID:', this.voiceId);

        try {
            // Remove emojis and clean text
            const cleanText = this.cleanText(text);

            if (!cleanText) {
                if (onEnd) onEnd();
                return;
            }

            // Debug: Log request details
            console.log('Making ElevenLabs API request:');
            console.log('- URL:', `${this.baseUrl}/text-to-speech/${this.voiceId}`);
            console.log('- API Key (first 15 chars):', this.apiKey?.substring(0, 15));
            console.log('- Text length:', cleanText.length);

            // Call ElevenLabs API
            const response = await fetch(
                `${this.baseUrl}/text-to-speech/${this.voiceId}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey,
                    },
                    body: JSON.stringify({
                        text: cleanText,
                        model_id: 'eleven_monolingual_v1',
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.75,
                            style: 0.0,
                            use_speaker_boost: true
                        }
                    }),
                }
            );

            if (!response.ok) {
                const errorMessage = `ElevenLabs API error: ${response.status} ${response.statusText}`;

                // Handle specific error cases
                if (response.status === 402) {
                    console.warn('ElevenLabs: Payment required or quota exceeded. Falling back to browser TTS.');
                    throw new Error('PAYMENT_REQUIRED');
                } else if (response.status === 401) {
                    console.error('ElevenLabs: Invalid API key');
                    throw new Error('INVALID_API_KEY');
                }

                throw new Error(errorMessage);
            }

            // Convert response to audio blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Create and play audio
            const audio = new Audio(audioUrl);
            this.currentAudio = audio;

            audio.onplay = () => {
                this.isPlaying = true;
                if (onStart) onStart();
            };

            audio.onended = () => {
                this.isPlaying = false;
                this.currentAudio = null;
                URL.revokeObjectURL(audioUrl);
                if (onEnd) onEnd();
            };

            audio.onerror = (error) => {
                this.isPlaying = false;
                this.currentAudio = null;
                URL.revokeObjectURL(audioUrl);
                console.error('Audio playback error:', error);
                if (onError) onError(error);
            };

            await audio.play();

        } catch (error) {
            console.error('ElevenLabs TTS error:', error);
            this.isPlaying = false;
            this.currentAudio = null;
            if (onError) onError(error);
        }
    }

    /**
     * Stop current speech
     */
    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlaying = false;
    }

    /**
     * Check if currently speaking
     */
    isSpeaking() {
        return this.isPlaying;
    }

    /**
     * Clean text for speech synthesis
     * @param {string} text - Text to clean
     * @returns {string} - Cleaned text
     */
    cleanText(text) {
        return text
            // Remove emojis
            .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            .trim();
    }
}

// Create singleton instance
const elevenLabsTTS = new ElevenLabsTTSService();

export default elevenLabsTTS;
