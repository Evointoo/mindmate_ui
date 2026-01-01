import { motion } from 'framer-motion';
import { Shield, Phone, X } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * EmergencyButton - Premium crisis support button
 * Subtle but visible, professional appearance
 */
const EmergencyButton = ({ onClick, position = 'bottom-right' }) => {
    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6',
    };

    return (
        <motion.button
            onClick={onClick}
            className={`
        fixed ${positionClasses[position]} z-50
        p-4 rounded-full
        bg-white/5 backdrop-blur-glass
        border border-white/10 hover:border-white/20
        shadow-glass
        transition-all duration-300
        group
      `}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Emergency support"
        >
            {/* Subtle pulse */}
            <motion.div
                className="absolute inset-0 rounded-full bg-white/5"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Icon */}
            <Shield
                size={20}
                className="relative z-10 text-white/60 group-hover:text-white transition-colors"
                strokeWidth={1.5}
            />
        </motion.button>
    );
};

EmergencyButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left']),
};

/**
 * CrisisModal - Premium crisis resources modal
 * Calm, serious, professional appearance
 */
export const CrisisModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const helplines = [
        {
            name: 'KIRAN',
            fullName: 'Government of India Mental Health Helpline',
            number: '1800-599-0019',
            description: '24/7 Mental Health Support',
            hours: 'Available 24/7',
        },
        {
            name: 'iCall',
            fullName: 'Psychosocial Helpline',
            number: '9152987821',
            description: 'Professional Counseling',
            hours: 'Mon-Sat, 8 AM - 10 PM',
        },
        {
            name: 'AASRA',
            fullName: 'Crisis Intervention Centre',
            number: '9820466726',
            description: '24/7 Crisis Support',
            hours: 'Available 24/7',
        },
        {
            name: 'Vandrevala Foundation',
            fullName: 'Mental Health Support',
            number: '1860-2662-345',
            description: '24/7 Professional Help',
            hours: 'Available 24/7',
        },
    ];

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="glass-panel max-w-md w-full p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Shield size={20} className="text-white/60" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Crisis Support</h2>
                            <p className="text-sm text-white/40">You're not alone</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} className="text-white/40" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Helplines */}
                <div className="space-y-3 mb-6">
                    {helplines.map((helpline, index) => (
                        <motion.a
                            key={index}
                            href={`tel:${helpline.number.replace(/\s/g, '')}`}
                            className="block p-4 bg-white/5 hover:bg-white/8 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h3 className="font-medium text-white mb-0.5">{helpline.name}</h3>
                                    <p className="text-xs text-white/40 mb-2">{helpline.fullName}</p>
                                    <p className="text-xs text-white/60">{helpline.hours}</p>
                                </div>
                                <div className="flex items-center gap-2 text-green-neon">
                                    <Phone size={16} strokeWidth={1.5} />
                                    <span className="font-mono text-sm font-medium">{helpline.number}</span>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Important message */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-4">
                    <p className="text-xs text-white/60 text-center leading-relaxed">
                        If you're in immediate danger, please call emergency services (112) or visit the nearest hospital.
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 transition-all"
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
    );
};

CrisisModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EmergencyButton;
