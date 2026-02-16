import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Clock, Heart, Mic } from 'lucide-react'; // Added Mic icon
import { chatAPI, personalAIAPI, profileAPI } from '../utils/api';
import {
    MicrophoneButton,
    WaveformVisualizer,
    MoodSlider,
    ChatBubble,
    EmergencyButton,
    CrisisModal,
    SessionTimer,
    EndSessionModal, // Import the new modal
} from '../components';
import './VoiceTherapySession.css';

function VoiceTherapySession({ user, accessToken, onEndSession }) {
    // Session state
    const [sessionId, setSessionId] = useState(null);
    const [sessionTime, setSessionTime] = useState(0);
    const [moodBefore, setMoodBefore] = useState(null);
    const [moodAfter, setMoodAfter] = useState(null); // Track mood after
    const [showMoodInput, setShowMoodInput] = useState(true);
    const [showEndSessionModal, setShowEndSessionModal] = useState(false); // Modal state
    const [aiVoice, setAiVoice] = useState(null); // User's selected AI voice
    const [userName, setUserName] = useState(''); // User's actual name

    // Voice state
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioLevel, setAudioLevel] = useState(50);

    // UI state
    const [transcript, setTranscript] = useState([]);
    const [showTranscript, setShowTranscript] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [showCrisisModal, setShowCrisisModal] = useState(false);
    const [statusText, setStatusText] = useState('');

    // Refs
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);
    const sessionIdRef = useRef(null);
    const transcriptEndRef = useRef(null);

    // Fetch user's AI voice and profile on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Fetch AI voice
                const aiResponse = await personalAIAPI.getProfile(user.id);
                setAiVoice(aiResponse.data.voice_model);
                if (aiResponse.data.avatar_url) {
                    setAvatarUrl(aiResponse.data.avatar_url);
                }
                console.log('AI Voice loaded:', aiResponse.data.voice_model);

                // Fetch user's actual name from profile
                const profileResponse = await profileAPI.getProfile(user.id);
                if (profileResponse.data.actual_name) {
                    setUserName(profileResponse.data.actual_name);
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                // Fallback to default voice
                setAiVoice('kavya');
            }
        };
        fetchUserProfile();
    }, [user.id]);

    // Auto-scroll transcript
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    // Start session when mood is set
    const startSession = async (mood) => {
        try {
            console.log('Starting friendly chat with mood:', mood);
            const response = await chatAPI.startSession(user.id, mood);

            const { session_id, initial_greeting } = response.data;
            setSessionId(session_id);
            sessionIdRef.current = session_id;
            setMoodBefore(mood);
            setShowMoodInput(false);

            // Add initial greeting to transcript
            if (initial_greeting) {
                setTranscript([
                    {
                        role: 'assistant',
                        content: initial_greeting,
                        timestamp: new Date().toISOString(),
                    },
                ]);

                // Speak the greeting
                speakText(initial_greeting, () => {
                    // Start listening after greeting
                    setTimeout(() => {
                        if (recognitionRef.current && !isRecording) {
                            recognitionRef.current.start();
                            setIsRecording(true);
                            setStatusText('Listening...');
                        }
                    }, 500);
                });
            }

            // Start timer
            timerRef.current = setInterval(() => {
                setSessionTime((prev) => prev + 1);
            }, 1000);

            // Initialize speech recognition
            initSpeechRecognition();
        } catch (error) {
            console.error('Failed to start session:', error);
            alert('Failed to start session. Please try again.');
        }
    };

    // Initialize speech recognition
    const initSpeechRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition not supported. Please use Chrome or Edge.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
            console.log('Speech recognition started');
            setStatusText('Listening...');
        };

        recognition.onresult = async (event) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;

            if (event.results[current].isFinal) {
                console.log('Final transcript:', transcriptText);

                // Stop recording
                if (recognitionRef.current) {
                    recognitionRef.current.stop();
                    setIsRecording(false);
                }

                // Add user message to transcript
                setTranscript((prev) => [
                    ...prev,
                    {
                        role: 'user',
                        content: transcriptText,
                        timestamp: new Date().toISOString(),
                    },
                ]);

                // Send to backend
                await sendMessage(transcriptText);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
    };

    // Toggle recording
    const toggleRecording = () => {
        if (!recognitionRef.current) return;

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            setStatusText('');
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
            setStatusText('Listening...');

            // Simulate audio level
            const levelInterval = setInterval(() => {
                setAudioLevel(Math.random() * 60 + 40);
            }, 100);

            setTimeout(() => clearInterval(levelInterval), 3000);
        }
    };

    // Send message to backend
    const sendMessage = async (message) => {
        try {
            // Stop any ongoing speech
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }

            setStatusText('Processing...');

            const response = await chatAPI.sendMessage(user.id, sessionIdRef.current, message);

            const { assistant_response, crisis_detected } = response.data;

            // Add assistant response to transcript
            setTranscript((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: assistant_response,
                    timestamp: new Date().toISOString(),
                },
            ]);

            // Speak the response
            speakText(assistant_response, () => {
                // Restart listening after AI finishes speaking
                setTimeout(() => {
                    if (recognitionRef.current && !isRecording) {
                        recognitionRef.current.start();
                        setIsRecording(true);
                        setStatusText('Listening...');
                    }
                }, 500);
            });

            // Handle crisis detection
            if (crisis_detected && crisis_detected !== 'none') {
                setShowCrisisModal(true);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setStatusText('');
        }
    };

    // Text-to-speech using Sarvam AI STREAMING with fallback to browser TTS
    const speakText = async (text, onEnd) => {
        const apiKey = import.meta.env.VITE_SARVAM_API_KEY;

        // If no API key or no AI voice selected, use browser TTS
        if (!apiKey || !aiVoice) {
            console.warn('Sarvam API key or AI voice not available, using browser TTS');
            fallbackToBrowserTTS(text, onEnd);
            return;
        }

        try {
            setIsSpeaking(true);
            setStatusText('MindMate is speaking...');

            const response = await fetch('https://api.sarvam.ai/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': apiKey
                },
                body: JSON.stringify({
                    inputs: [text],
                    target_language_code: 'en-IN',
                    speaker: aiVoice,
                    model: 'bulbul:v3',
                    pace: 1.0,
                    speech_sample_rate: 16000,
                    output_audio_codec: 'mp3', // MP3 for streaming
                    enable_preprocessing: false
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Sarvam Streaming API error:', response.status, errorText);
                throw new Error(`Sarvam streaming failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Sarvam API success');

            if (data.audios && data.audios.length > 0) {
                // Play the audio
                const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);

                audio.onended = () => {
                    setIsSpeaking(false);
                    setStatusText('');
                    if (onEnd) onEnd();
                };

                audio.onerror = (error) => {
                    console.error('Audio playback error:', error);
                    setIsSpeaking(false);
                    setStatusText('');
                    // Fallback to browser TTS
                    fallbackToBrowserTTS(text, onEnd);
                };

                audio.play();
            } else {
                throw new Error('No audio data received');
            }
        } catch (error) {
            console.error('Sarvam TTS error:', error);
            // Fallback to browser TTS
            fallbackToBrowserTTS(text, onEnd);
        }
    };

    // Fallback to browser TTS if ElevenLabs fails
    const fallbackToBrowserTTS = (text, onEnd) => {
        if ('speechSynthesis' in window) {
            const textWithoutEmojis = text
                .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            const utterance = new SpeechSynthesisUtterance(textWithoutEmojis);
            utterance.lang = 'en-IN';
            utterance.rate = 0.9;

            utterance.onend = () => {
                setIsSpeaking(false);
                setStatusText('');
                if (onEnd) onEnd();
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    // Confirm end session (Step 1: Show Modal)
    const handleEndSessionClick = () => {
        setShowEndSessionModal(true);
    };

    // Finalize end session (Step 2: API Call)
    const handleConfirmEndSession = async () => {
        if (!moodAfter) return;

        try {
            // Stop recognition and timer
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }

            await chatAPI.endSession(user.id, sessionIdRef.current, parseInt(moodAfter));

            onEndSession();
        } catch (error) {
            console.error('Failed to end session:', error);
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Mood input screen
    if (showMoodInput) {
        return (
            <div className="min-h-screen bg-black-primary flex items-center justify-center p-4">
                <motion.div
                    className="max-w-md w-full glass-panel p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white/5 rounded-2xl border border-white/10">
                            <Heart size={32} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-2">How are you feeling?</h2>
                        <p className="text-white/60 text-sm">Rate your current mood to begin</p>
                    </div>

                    <MoodSlider value={moodBefore} onChange={setMoodBefore} showIcon={true} showLabel={true} />

                    <button
                        onClick={() => moodBefore && startSession(moodBefore)}
                        disabled={!moodBefore}
                        className="btn-primary w-full mt-8"
                    >
                        Start Chat
                    </button>
                </motion.div>
            </div>
        );
    }

    // Main chat screen
    return (
        <div className="min-h-screen bg-black-primary flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-black-primary via-black-secondary to-black-tertiary z-0" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black-primary to-transparent z-10" />

            {/* Header */}
            <motion.header
                className="relative z-20 px-6 py-4 flex items-center justify-between"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                {/* Left: Logo */}
                <div className="flex items-center">
                    <img src="/logo.svg" alt="MindMate" className="h-10 w-auto object-contain" />
                </div>

                {/* Center: Session Info (Absolutely centered) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-sm text-white">
                    {userName && (
                        <>
                            <span className="text-green-neon font-semibold">{userName}</span>
                            <span className="text-white/40">•</span>
                        </>
                    )}
                    <SessionTimer seconds={sessionTime} />
                    <span className="text-white/40">•</span>
                    <span>Mood: {moodBefore}/10</span>
                    <span className="text-white/40">•</span>
                    <span className="text-green-neon font-semibold">Voice Mode</span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="text-white/40 hover:text-white/60 text-xs flex items-center gap-1 transition-colors"
                    >
                        <MessageSquare size={12} className="text-green-neon" strokeWidth={1.5} />
                        {showTranscript ? 'Hide' : 'Show'} Transcript
                    </button>

                    <button
                        onClick={handleEndSessionClick}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                        End Chat
                    </button>
                </div>
            </motion.header>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                {/* Center: Waveform + Microphone + Avatar */}
                <div className="flex flex-col items-center gap-8 w-full max-w-2xl">

                    {/* AI Avatar */}
                    <div className="relative">
                        {/* Glow effect when speaking */}
                        {isSpeaking && (
                            <motion.div
                                className="absolute inset-0 bg-green-neon/40 rounded-full blur-2xl"
                                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}

                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 relative z-10 shadow-2xl bg-black-secondary">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl.startsWith('http') ? avatarUrl : avatarUrl}
                                    alt="MindMate"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                    <img src="/logo.svg" alt="MindMate" className="w-20 h-20 opacity-50" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* New Waveform Visualizer (Placeholder for canvas update next) */}
                    <div className="h-24 w-full flex items-center justify-center">
                        <WaveformVisualizer
                            isActive={isRecording || isSpeaking}
                            audioLevel={audioLevel}
                            barCount={60} // Increased count for smoother look temporarily
                            height={120}
                        />
                    </div>

                    {/* Microphone */}
                    <div className="relative">
                        {/* Glow effect */}
                        {(isRecording || isSpeaking) && (
                            <motion.div
                                className="absolute inset-0 bg-green-neon/20 rounded-full blur-xl"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}

                        <MicrophoneButton
                            isRecording={isRecording}
                            onClick={toggleRecording}
                            size={100} // Smaller size
                            disabled={isSpeaking}
                        />
                    </div>

                    {/* Status text */}
                    <div className="h-6 text-center">
                        <AnimatePresence mode="wait">
                            {statusText && (
                                <motion.p
                                    key={statusText}
                                    className="text-white/60 text-sm font-medium tracking-wide"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                >
                                    {statusText}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Transcript sidebar - overlay */}
                <AnimatePresence>
                    {showTranscript && (
                        <motion.div
                            className="absolute right-0 top-0 bottom-0 w-full md:w-96 glass-panel border-l p-6 overflow-y-auto z-30 backdrop-blur-xl bg-black-primary/40"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="flex items-center justify-between mb-8 sticky top-0 glass-panel p-3 -mx-2 z-10 bg-black-primary/20 backdrop-blur-md">
                                <h3 className="text-lg font-semibold text-white">Transcript</h3>
                                <button
                                    onClick={() => setShowTranscript(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={18} className="text-white/60" strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="space-y-6 pb-20">
                                {transcript.map((message, index) => (
                                    <ChatBubble
                                        key={index}
                                        role={message.role}
                                        content={message.content}
                                        timestamp={message.timestamp}
                                        avatarUrl={avatarUrl}
                                    />
                                ))}
                                <div ref={transcriptEndRef} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Emergency button - Bottom center/right */}
            <div className="absolute bottom-6 right-6 z-20">
                <EmergencyButton onClick={() => setShowCrisisModal(true)} />
            </div>

            <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />

            {/* End Session Modal */}
            <EndSessionModal
                isOpen={showEndSessionModal}
                onClose={() => setShowEndSessionModal(false)}
                onConfirm={handleConfirmEndSession}
                mood={moodAfter}
                setMood={setMoodAfter}
            />
        </div>
    );
}

export default VoiceTherapySession;
