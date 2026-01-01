import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ExerciseCard - Card for grounding exercises
 * Displays exercise info with start button
 */
const ExerciseCard = ({
    title,
    duration,
    description,
    icon: Icon,
    onStart,
    color = 'purple'
}) => {
    const getColorClasses = () => {
        const colors = {
            purple: 'from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500',
            teal: 'from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500',
            pink: 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500',
            green: 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
        };
        return colors[color] || colors.purple;
    };

    return (
        <motion.div
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, borderColor: 'rgba(139, 92, 246, 0.5)' }}
            transition={{ duration: 0.2 }}
        >
            {/* Icon */}
            {Icon && (
                <div className="mb-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${getColorClasses()}`}>
                        <Icon size={24} className="text-white" />
                    </div>
                </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <Clock size={14} />
                <span>{duration}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                {description}
            </p>

            {/* Start button */}
            <motion.button
                onClick={onStart}
                className={`
          w-full flex items-center justify-center gap-2 py-3 px-4
          bg-gradient-to-r ${getColorClasses()}
          text-white font-semibold rounded-lg
          transition-all duration-200
        `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Play size={16} />
                <span>Start Exercise</span>
            </motion.button>
        </motion.div>
    );
};

ExerciseCard.propTypes = {
    title: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    onStart: PropTypes.func.isRequired,
    color: PropTypes.oneOf(['purple', 'teal', 'pink', 'green']),
};

export default ExerciseCard;
