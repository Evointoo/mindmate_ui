import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * MoodSlider - Premium minimalist mood rating (1-10)
 * Thin slider with muted gradient, professional and calm
 */
const MoodSlider = ({
    value,
    onChange,
    showIcon = true,
    showLabel = true,
    disabled = false
}) => {
    const getMoodColor = (mood) => {
        if (mood <= 3) return '#EF4444'; // Muted red
        if (mood <= 5) return '#F59E0B'; // Muted orange
        if (mood <= 7) return '#FBBF24'; // Muted yellow
        return '#22C55E'; // Neon green
    };

    const getMoodLabel = (mood) => {
        if (mood <= 3) return 'Low';
        if (mood <= 5) return 'Medium';
        if (mood <= 7) return 'Good';
        return 'Great';
    };

    return (
        <div className="w-full space-y-6">
            {/* Slider track */}
            <div className="relative">
                {/* Background track */}
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    {/* Gradient fill */}
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            background: `linear-gradient(to right, #EF4444, #F59E0B, #FBBF24, #22C55E)`,
                            width: `${(value || 0) * 10}%`,
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${(value || 0) * 10}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                </div>

                {/* Slider thumb */}
                {value && (
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -ml-2"
                        style={{ left: `${(value || 0) * 10}%` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <div
                            className="w-4 h-4 rounded-full border-2 border-white bg-black-primary shadow-lg"
                            style={{ borderColor: getMoodColor(value) }}
                        />
                    </motion.div>
                )}
            </div>

            {/* Number buttons */}
            <div className="grid grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                    <motion.button
                        key={mood}
                        onClick={() => !disabled && onChange(mood)}
                        disabled={disabled}
                        className={`
              relative aspect-square rounded-lg font-medium text-sm
              transition-all duration-200
              ${value === mood
                                ? 'bg-white/10 border-2 text-white'
                                : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/8 hover:text-white/60'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                        style={value === mood ? { borderColor: getMoodColor(mood) } : undefined}
                        whileHover={!disabled ? { scale: 1.05 } : undefined}
                        whileTap={!disabled ? { scale: 0.95 } : undefined}
                        aria-label={`Mood level ${mood}`}
                    >
                        {mood}
                    </motion.button>
                ))}
            </div>

            {/* Visual feedback */}
            {value && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-4"
                >
                    {showIcon && (
                        <div
                            className="p-3 rounded-lg bg-white/5 border border-white/10"
                            style={{ borderColor: `${getMoodColor(value)}40` }}
                        >
                            <Activity
                                size={24}
                                style={{ color: getMoodColor(value) }}
                                strokeWidth={1.5}
                            />
                        </div>
                    )}
                    {showLabel && (
                        <div className="text-center">
                            <div
                                className="text-2xl font-semibold"
                                style={{ color: getMoodColor(value) }}
                            >
                                {value}/10
                            </div>
                            <div className="text-sm text-white/40 font-medium">
                                {getMoodLabel(value)}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

MoodSlider.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    showIcon: PropTypes.bool,
    showLabel: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default MoodSlider;
