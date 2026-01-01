import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * MicrophoneButton - Updated Modern Design
 * Compact, sleeker look with dynamic gradient pulse.
 */
const MicrophoneButton = ({
    isRecording,
    onClick,
    size = 80, // Default size reduced
    disabled = false,
}) => {
    return (
        <div className="relative flex items-center justify-center">
            {/* Ambient Glow (Active state) */}
            {isRecording && (
                <motion.div
                    className="absolute bg-green-neon/30 rounded-full blur-2xl"
                    style={{ width: size * 1.5, height: size * 1.5 }}
                    animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}

            {/* Ripple Effects (Active state) */}
            {isRecording && (
                <>
                    <motion.div
                        className="absolute rounded-full border border-green-neon/50"
                        style={{ width: size, height: size }}
                        animate={{
                            width: [size, size * 1.8],
                            height: [size, size * 1.8],
                            opacity: [0.8, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    />
                    <motion.div
                        className="absolute rounded-full border border-green-neon/30"
                        style={{ width: size, height: size }}
                        animate={{
                            width: [size, size * 1.6],
                            height: [size, size * 1.6],
                            opacity: [0.6, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            delay: 0.5,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    />
                </>
            )}

            {/* Main Button */}
            <motion.button
                onClick={onClick}
                disabled={disabled}
                className={`
                    relative z-10 flex items-center justify-center rounded-full
                    backdrop-blur-md transition-all duration-300
                    ${isRecording
                        ? 'bg-gradient-to-br from-green-neon/20 to-green-secondary/20 border-green-neon/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                    }
                    border
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{ width: size, height: size }}
                whileHover={!disabled ? { scale: 1.05 } : undefined}
                whileTap={!disabled ? { scale: 0.95 } : undefined}
            >
                {isRecording ? (
                    <Mic
                        size={size * 0.4}
                        className="text-green-neon drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]"
                        strokeWidth={2}
                    />
                ) : (
                    <MicOff
                        size={size * 0.4}
                        className="text-white/40"
                        strokeWidth={1.5}
                    />
                )}
            </motion.button>
        </div>
    );
};

MicrophoneButton.propTypes = {
    isRecording: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    size: PropTypes.number,
    disabled: PropTypes.bool,
};

export default MicrophoneButton;
