import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MessageSquare, X } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ModeSelectionModal - Choose between Voice and Chat therapy modes
 * Displays before session starts to let user select interaction method
 */
const ModeSelectionModal = ({ isOpen, onSelectMode, onClose }) => {
    const handleModeSelect = (mode) => {
        onSelectMode(mode);
    };

    const handleKeyDown = (e, mode) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleModeSelect(mode);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="glass-panel max-w-2xl w-full p-8 relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} className="text-white/60" strokeWidth={1.5} />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-semibold text-white mb-2">
                                How would you like to chat today?
                            </h2>
                            <p className="text-white/60 text-sm">
                                Choose your preferred way to communicate with MindMate
                            </p>
                        </div>

                        {/* Mode Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Voice Mode */}
                            <motion.button
                                onClick={() => handleModeSelect('voice')}
                                onKeyDown={(e) => handleKeyDown(e, 'voice')}
                                className="group relative p-8 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-neon/50 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-green-neon/50"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                tabIndex={0}
                            >
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-neon/10 rounded-2xl border border-green-neon/20 group-hover:bg-green-neon/20 transition-colors">
                                    <Mic size={32} className="text-green-neon" strokeWidth={1.5} />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-semibold text-white mb-3">
                                    Voice-Based
                                </h3>

                                {/* Description */}
                                <p className="text-white/60 text-sm leading-relaxed mb-4">
                                    Speak freely and naturally. I'll listen and respond with voice,
                                    creating a conversational therapy experience.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2 text-xs text-white/50">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-green-neon/50"></span>
                                        Hands-free conversation
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-green-neon/50"></span>
                                        Real-time voice responses
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-green-neon/50"></span>
                                        Natural, flowing dialogue
                                    </li>
                                </ul>

                                {/* Hover indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-green-neon text-sm font-medium">Select →</span>
                                </div>
                            </motion.button>

                            {/* Chat Mode */}
                            <motion.button
                                onClick={() => handleModeSelect('chat')}
                                onKeyDown={(e) => handleKeyDown(e, 'chat')}
                                className="group relative p-8 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-neon/50 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-green-neon/50"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                tabIndex={0}
                            >
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-neon/10 rounded-2xl border border-green-neon/20 group-hover:bg-green-neon/20 transition-colors">
                                    <MessageSquare size={32} className="text-green-neon" strokeWidth={1.5} />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-semibold text-white mb-3">
                                    Chat-Based
                                </h3>

                                {/* Description */}
                                <p className="text-white/60 text-sm leading-relaxed mb-4">
                                    Type your thoughts or record voice messages. Review and edit
                                    before sending for a more controlled experience.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2 text-xs text-white/50">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-green-neon/50"></span>
                                        Text or voice input options
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-green-neon/50"></span>
                                        Edit messages before sending
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-green-neon/50"></span>
                                        Full conversation history
                                    </li>
                                </ul>

                                {/* Hover indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-green-neon text-sm font-medium">Select →</span>
                                </div>
                            </motion.button>
                        </div>

                        {/* Footer hint */}
                        <div className="mt-6 text-center">
                            <p className="text-white/40 text-xs">
                                You can choose a different mode for each session
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

ModeSelectionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSelectMode: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ModeSelectionModal;
