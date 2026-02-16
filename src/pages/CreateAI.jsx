import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Sparkles, ChevronRight, Volume2 } from 'lucide-react';
import { personalAIAPI } from '../utils/api';

function CreateAI({ user }) {
    const navigate = useNavigate();
    const [aiName, setAiName] = useState('');
    const [aiGender, setAiGender] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);

    const genderOptions = [
        {
            value: 'female',
            label: 'Female',
            description: 'Warm, empathetic, expressive',
            voice: 'kavya' // Sarvam AI voice
        },
        {
            value: 'male',
            label: 'Male',
            description: 'Confident, supportive, grounded',
            voice: 'shubh' // Sarvam AI voice
        },
        {
            value: 'neutral',
            label: 'Neutral',
            description: 'Balanced, calm, intelligent',
            voice: 'ritu' // Sarvam AI voice
        }
    ];

    const playVoicePreview = async (voice) => {
        try {
            const apiKey = import.meta.env.VITE_SARVAM_API_KEY;
            if (!apiKey) {
                console.warn('Sarvam API key not found');
                return;
            }

            const response = await fetch('https://api.sarvam.ai/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': apiKey
                },
                body: JSON.stringify({
                    inputs: [`Hi! I'm your AI companion. I'm here to support you.`],
                    target_language_code: 'en-IN',
                    speaker: voice,
                    pace: 1.0,
                    speech_sample_rate: 16000,
                    enable_preprocessing: true,
                    model: 'bulbul:v3'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate voice preview');
            }

            const data = await response.json();
            if (data.audios && data.audios.length > 0) {
                // Play the audio
                const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
                audio.play();
            }
        } catch (error) {
            console.error('Voice preview error:', error);
        }
    };

    const handleCreate = async () => {
        if (!aiName || aiName.trim().length < 2) {
            setError('Please enter a name for your AI');
            return;
        }
        if (!aiGender) {
            setError('Please select a gender for your AI');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await personalAIAPI.create({
                user_id: user.id,
                ai_name: aiName,
                ai_gender: aiGender
            });

            setPreview(response.data);

            // Wait 3 seconds to show preview, then redirect to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (err) {
            console.error('AI creation error:', err);
            setError(err.response?.data?.detail || 'Failed to create AI');
            setLoading(false);
        }
    };

    if (preview) {
        return (
            <div className="min-h-screen bg-black-primary flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black-primary via-black-secondary to-black-tertiary" />
                <div className="absolute inset-0 bg-green-neon/5 rounded-full blur-3xl animate-pulse" />

                <motion.div
                    className="relative z-10 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="glass-panel p-12 max-w-2xl mx-auto">
                        <Sparkles className="text-green-neon mx-auto mb-6" size={64} />
                        <h2 className="text-4xl font-bold text-white mb-4">Meet {preview.ai_name}!</h2>
                        <p className="text-lg text-white/80 mb-6">{preview.personality_alignment_reason}</p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-xs text-white/60 mb-1">Gender</p>
                                <p className="text-sm font-semibold text-green-neon capitalize">{preview.ai_gender}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-xs text-white/60 mb-1">Voice</p>
                                <p className="text-sm font-semibold text-green-neon">{preview.voice_model.replace('_', ' ')}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-xs text-white/60 mb-1">Style</p>
                                <p className="text-sm font-semibold text-green-neon capitalize">{preview.tone_style.split(',')[0]}</p>
                            </div>
                        </div>

                        <p className="text-white/60 text-sm">Redirecting to dashboard...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black-primary flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black-primary via-black-secondary to-black-tertiary" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-neon/5 rounded-full blur-3xl" />

            <motion.div
                className="relative z-10 w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="glass-panel p-8">
                    <div className="text-center mb-8">
                        <Bot className="text-green-neon mx-auto mb-4" size={48} />
                        <h2 className="text-3xl font-bold text-white mb-3">Create Your AI Companion</h2>
                        <p className="text-white/60">Choose a name and personality for your AI friend</p>
                    </div>

                    {/* AI Name */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            AI Name
                        </label>
                        <input
                            type="text"
                            value={aiName}
                            onChange={(e) => setAiName(e.target.value)}
                            placeholder="e.g., Alex, Luna, Max"
                            className="input-glass text-center text-2xl font-semibold"
                            disabled={loading}
                        />
                    </div>

                    {/* Gender Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-white/80 mb-4 text-center">
                            Choose AI Gender & Personality
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {genderOptions.map((option) => (
                                <motion.div
                                    key={option.value}
                                    onClick={() => setAiGender(option.value)}
                                    className={`p-6 rounded-lg text-center transition-all ${aiGender === option.value
                                        ? 'bg-green-neon/20 border-2 border-green-neon'
                                        : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={loading}
                                >
                                    <p className="text-white font-semibold mb-2 text-lg">{option.label}</p>
                                    <p className="text-xs text-white/60 mb-4">{option.description}</p>

                                    {/* Voice Preview Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playVoicePreview(option.voice);
                                        }}
                                        className="btn-ghost w-full text-xs flex items-center justify-center gap-1 py-2"
                                        disabled={loading}
                                    >
                                        <Volume2 size={14} />
                                        Preview Voice
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mb-8 p-4 bg-green-neon/10 border border-green-neon/30 rounded-lg">
                        <p className="text-sm text-white/80 text-center">
                            <Sparkles className="inline w-4 h-4 mr-1 text-green-neon" />
                            Your AI's personality will complement yours based on your analysis
                        </p>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={handleCreate}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Your AI'}
                        <ChevronRight size={18} />
                    </button>

                    {/* Error */}
                    {error && (
                        <motion.div
                            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default CreateAI;
