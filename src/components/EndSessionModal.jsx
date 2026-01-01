import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { MoodSlider } from './index';

function EndSessionModal({ isOpen, onClose, onConfirm, mood, setMood }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    className="relative w-full max-w-md glass-panel p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Content */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white/5 rounded-2xl border border-white/10">
                            <Heart size={32} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-2">Session Complete</h2>
                        <p className="text-white/60 text-sm">How are you feeling right now?</p>
                    </div>

                    {/* Mood Slider */}
                    <div className="mb-8">
                        <MoodSlider
                            value={mood}
                            onChange={setMood}
                            showIcon={true}
                            showLabel={true}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={!mood}
                            className="btn-primary w-full py-3 text-black font-medium"
                        >
                            End Session
                        </button>
                        <button
                            onClick={onClose}
                            className="btn-ghost w-full py-2 text-white/60 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default EndSessionModal;
