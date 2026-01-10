import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, X, Check, Edit3 } from 'lucide-react';
import PropTypes from 'prop-types';
import WaveformVisualizer from './WaveformVisualizer';

/**
 * VoiceRecordingModal - Record voice, transcribe, and edit in chat mode
 * Allows user to review and modify transcription before sending
 */
const VoiceRecordingModal = ({ isOpen, onConfirm, onCancel }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcribedText, setTranscribedText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [audioLevel, setAudioLevel] = useState(50);
    const [error, setError] = useState('');

    const recognitionRef = useRef(null);
    const textareaRef = useRef(null);

    // Initialize speech recognition when modal opens
    useEffect(() => {
        if (isOpen) {
            initSpeechRecognition();
            setTranscribedText('');
            setIsEditing(false);
            setError('');
        } else {
            // Cleanup when modal closes
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsRecording(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isOpen]);

    // Auto-focus textarea when entering edit mode
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditing]);

    const initSpeechRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
            setIsRecording(true);
            setError('');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update transcribed text (final + interim)
            setTranscribedText((prev) => {
                const newText = prev + finalTranscript;
                return newText || interimTranscript;
            });
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setError(`Error: ${event.error}. Please try again.`);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
    };

    const startRecording = () => {
        if (recognitionRef.current && !isRecording) {
            setTranscribedText('');
            recognitionRef.current.start();

            // Simulate audio level animation
            const levelInterval = setInterval(() => {
                setAudioLevel(Math.random() * 60 + 40);
            }, 100);

            setTimeout(() => clearInterval(levelInterval), 30000); // Stop after 30s
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            setIsEditing(true); // Switch to edit mode
        }
    };

    const handleConfirm = () => {
        if (transcribedText.trim()) {
            onConfirm(transcribedText.trim());
            setTranscribedText('');
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setTranscribedText('');
        setIsRecording(false);
        setIsEditing(false);
        onCancel();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCancel}
                >
                    <motion.div
                        className="glass-panel max-w-lg w-full p-8 relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleCancel}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} className="text-white/60" strokeWidth={1.5} />
                        </button>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Recording State */}
                        {!isEditing && (
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-neon/10 rounded-2xl border border-green-neon/20">
                                    <Mic size={32} className="text-green-neon" strokeWidth={1.5} />
                                </div>

                                <h3 className="text-2xl font-semibold text-white mb-2">
                                    {isRecording ? 'Recording...' : 'Record Your Message'}
                                </h3>

                                <p className="text-white/60 text-sm mb-6">
                                    {isRecording
                                        ? 'Speak clearly. Your words will appear below.'
                                        : 'Click the button below to start recording'}
                                </p>

                                {/* Waveform Visualizer */}
                                {isRecording && (
                                    <div className="h-24 w-full flex items-center justify-center mb-6">
                                        <WaveformVisualizer
                                            isActive={isRecording}
                                            audioLevel={audioLevel}
                                            barCount={40}
                                            height={80}
                                        />
                                    </div>
                                )}

                                {/* Live Transcript */}
                                {transcribedText && (
                                    <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg text-left">
                                        <p className="text-white/80 text-sm leading-relaxed">
                                            {transcribedText}
                                        </p>
                                    </div>
                                )}

                                {/* Recording Controls */}
                                <div className="flex gap-4 justify-center">
                                    {!isRecording ? (
                                        <button
                                            onClick={startRecording}
                                            disabled={!!error}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <Mic size={20} strokeWidth={1.5} />
                                            Start Recording
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopRecording}
                                            className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
                                        >
                                            <Square size={20} strokeWidth={1.5} />
                                            Stop Recording
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Editing State */}
                        {isEditing && (
                            <div>
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-neon/10 rounded-2xl border border-green-neon/20">
                                    <Edit3 size={32} className="text-green-neon" strokeWidth={1.5} />
                                </div>

                                <h3 className="text-2xl font-semibold text-white mb-2">
                                    Review Your Message
                                </h3>

                                <p className="text-white/60 text-sm mb-6">
                                    Edit the transcribed text if needed, then send
                                </p>

                                {/* Editable Textarea */}
                                <textarea
                                    ref={textareaRef}
                                    value={transcribedText}
                                    onChange={(e) => setTranscribedText(e.target.value)}
                                    className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 resize-none focus:outline-none focus:border-green-neon/50 transition-colors mb-6"
                                    placeholder="Your transcribed message will appear here..."
                                />

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl font-medium hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={!transcribedText.trim()}
                                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                                    >
                                        <Check size={20} strokeWidth={1.5} />
                                        Use This Text
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

VoiceRecordingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default VoiceRecordingModal;
