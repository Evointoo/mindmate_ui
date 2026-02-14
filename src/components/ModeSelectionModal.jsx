import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MessageSquare, X } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ModeSelectionModal - Choose between Voice and Chat modes
 * Displays before chat starts to let user select interaction method
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
                                className="group relative p-8 rounded-2xl border-2 border-green-neon/30 bg-gradient-to-br from-green-neon/20 to-green-dark/20 hover:from-green-neon/30 hover:to-green-dark/30 hover:border-green-neon/60 backdrop-blur-md transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-green-neon/50 shadow-lg hover:shadow-green-neon/30"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                tabIndex={0}
                            >
                                {/* Icon - Centered */}
                                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-neon/30 rounded-2xl border-2 border-green-neon/50 group-hover:bg-green-neon/40 group-hover:border-green-neon/70 transition-all shadow-lg shadow-green-neon/30">
                                    <Mic size={40} className="text-green-neon" strokeWidth={2} />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Voice-Based
                                </h3>

                                {/* Description */}
                                <p className="text-white/80 text-sm leading-relaxed mb-4 font-medium">
                                    Speak freely and naturally. I'll listen and respond with voice,
                                    creating a natural, friendly conversation.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2 text-sm text-white/70">
                                    <li className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-neon"></span>
                                        Hands-free conversation
                                    </li>
                                    <li className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-neon"></span>
                                        Real-time voice responses
                                    </li>
                                    <li className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-neon"></span>
                                        Natural, flowing dialogue
                                    </li>
                                </ul>

                                {/* Hover indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-green-neon text-sm font-bold">Select →</span>
                                </div>
                            </motion.button>

                            {/* Chat Mode */}
                            <motion.button
                                onClick={() => handleModeSelect('chat')}
                                onKeyDown={(e) => handleKeyDown(e, 'chat')}
                                className="group relative p-8 rounded-2xl border-2 border-green-neon/30 bg-gradient-to-br from-green-neon/20 to-green-dark/20 hover:from-green-neon/30 hover:to-green-dark/30 hover:border-green-neon/60 backdrop-blur-md transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-green-neon/50 shadow-lg hover:shadow-green-neon/30"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                tabIndex={0}
                            >
                                {/* Icon - Centered */}
                                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-neon/30 rounded-2xl border-2 border-green-neon/50 group-hover:bg-green-neon/40 group-hover:border-green-neon/70 transition-all shadow-lg shadow-green-neon/30">
                                    <MessageSquare size={40} className="text-green-neon" strokeWidth={2} />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Chat-Based
                                </h3>

                                {/* Description */}
                                <p className="text-white/80 text-sm leading-relaxed mb-4 font-medium">
                                    Type your thoughts or record voice messages. Review and edit
                                    before sending for a more controlled experience.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2 text-sm text-white/70">
                                    <li className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-neon"></span>
                                        Text or voice input options
                                    </li>
                                    <li className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-neon"></span>
                                        Edit messages before sending
                                    </li>
                                    <li className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-neon"></span>
                                        Full conversation history
                                    </li>
                                </ul>

                                {/* Hover indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-green-neon text-sm font-bold">Select →</span>
                                </div>
                            </motion.button>
                        </div>

                        {/* Footer hint */}
                        <div className="mt-6 text-center">
                            <p className="text-white/40 text-xs">
                                You can choose a different mode for each chat
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
