import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader } from 'lucide-react';
import { chatAPI } from '../utils/api';
import {
    MoodSlider,
    ChatBubble,
    EmergencyButton,
    CrisisModal,
    SessionTimer,
    EndSessionModal,
    VoiceRecordingModal,
    ChatInputBox,
} from '../components';

function ChatTherapySession({ user, accessToken, onEndSession }) {
    // Session state
    const [sessionId, setSessionId] = useState(null);
    const [sessionTime, setSessionTime] = useState(0);
    const [moodBefore, setMoodBefore] = useState(null);
    const [moodAfter, setMoodAfter] = useState(null);
    const [showMoodInput, setShowMoodInput] = useState(true);
    const [showEndSessionModal, setShowEndSessionModal] = useState(false);

    // Chat state
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Voice recording state
    const [showVoiceModal, setShowVoiceModal] = useState(false);

    // UI state
    const [showCrisisModal, setShowCrisisModal] = useState(false);

    // Refs
    const timerRef = useRef(null);
    const sessionIdRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Start session when mood is set
    const startSession = async (mood) => {
        try {
            console.log('Starting chat therapy session with mood:', mood);
            const response = await chatAPI.startSession(user.id, mood);

            const { session_id, initial_greeting } = response.data;
            setSessionId(session_id);
            sessionIdRef.current = session_id;
            setMoodBefore(mood);
            setShowMoodInput(false);

            // Add initial greeting to messages
            if (initial_greeting) {
                setMessages([
                    {
                        role: 'assistant',
                        content: initial_greeting,
                        timestamp: new Date().toISOString(),
                    },
                ]);
            }

            // Start timer
            timerRef.current = setInterval(() => {
                setSessionTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Failed to start session:', error);
            alert('Failed to start session. Please try again.');
        }
    };

    // Send message to backend
    const sendMessage = async (messageText) => {
        if (!messageText.trim() || isSending) return;

        try {
            setIsSending(true);

            // Add user message to chat
            const userMessage = {
                role: 'user',
                content: messageText,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, userMessage]);

            // Clear input
            setInputText('');

            // Send to backend
            const response = await chatAPI.sendMessage(user.id, sessionIdRef.current, messageText);

            const { assistant_response, crisis_detected } = response.data;

            // Add assistant response to chat
            const assistantMessage = {
                role: 'assistant',
                content: assistant_response,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);

            // Handle crisis detection
            if (crisis_detected && crisis_detected !== 'none') {
                setShowCrisisModal(true);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    // Handle voice recording confirmation
    const handleVoiceConfirm = (transcribedText) => {
        setShowVoiceModal(false);
        setInputText(transcribedText); // Put transcribed text in input box for user to review/edit
    };

    // Handle end session
    const handleEndSessionClick = () => {
        setShowEndSessionModal(true);
    };

    const handleConfirmEndSession = async () => {
        if (!moodAfter) return;

        try {
            // Stop timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
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
            if (timerRef.current) {
                clearInterval(timerRef.current);
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
                        Start Chat Session
                    </button>
                </motion.div>
            </div>
        );
    }

    // Main chat interface
    return (
        <div className="min-h-screen bg-black-primary flex flex-col relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black-primary via-black-secondary to-black-tertiary z-0" />

            {/* Header */}
            <motion.header
                className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between glass-panel border-b border-white/10 backdrop-blur-xl bg-black-primary/80 relative"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                {/* Left: Logo */}
                <div className="flex items-center">
                    <img src="/logo.svg" alt="MindMate" className="h-10 w-auto object-contain" />
                </div>

                {/* Center: Session Info (Absolutely centered) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-sm text-white">
                    <SessionTimer seconds={sessionTime} />
                    <span className="text-white/40">•</span>
                    <span>Mood: {moodBefore}/10</span>
                    <span className="text-white/40">•</span>
                    <span className="text-green-neon font-semibold">Chat Mode</span>
                </div>

                {/* Right: End Session */}
                <button
                    onClick={handleEndSessionClick}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                    End Session
                </button>
            </motion.header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10 backdrop-blur-sm bg-black-secondary/50">
                <div className="max-w-4xl mx-auto space-y-6 pb-6">
                    {messages.map((message, index) => (
                        <ChatBubble
                            key={index}
                            role={message.role}
                            content={message.content}
                            timestamp={message.timestamp}
                        />
                    ))}

                    {/* Loading indicator */}
                    {isSending && (
                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
                                <Loader size={16} className="text-white/60 animate-spin" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <div className="inline-block p-3 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-sm text-white/60">MindMate is thinking...</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Box - Fixed at bottom */}
            <div className="sticky bottom-0 z-20 backdrop-blur-xl bg-black-primary/80 border-t border-white/10">
                <ChatInputBox
                    value={inputText}
                    onChange={setInputText}
                    onSend={() => sendMessage(inputText)}
                    onVoiceClick={() => setShowVoiceModal(true)}
                    disabled={isSending}
                    placeholder="Type your message or click the microphone to record..."
                />
            </div>

            {/* Emergency button - Bottom right */}
            <div className="absolute bottom-24 right-6 z-20">
                <EmergencyButton onClick={() => setShowCrisisModal(true)} />
            </div>

            {/* Modals */}
            <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />

            <EndSessionModal
                isOpen={showEndSessionModal}
                onClose={() => setShowEndSessionModal(false)}
                onConfirm={handleConfirmEndSession}
                mood={moodAfter}
                setMood={setMoodAfter}
            />

            <VoiceRecordingModal
                isOpen={showVoiceModal}
                onConfirm={handleVoiceConfirm}
                onCancel={() => setShowVoiceModal(false)}
            />
        </div>
    );
}

export default ChatTherapySession;
