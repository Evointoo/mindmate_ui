import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * InsightCard - Displays AI-generated mood insights
 * Shows trends, patterns, and actionable recommendations
 */
const InsightCard = ({
    title,
    description,
    trend, // 'up', 'down', 'neutral'
    value,
    icon: Icon = Lightbulb,
    color = 'purple'
}) => {
    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp size={20} className="text-green-500" />;
            case 'down':
                return <TrendingDown size={20} className="text-red-500" />;
            default:
                return <Minus size={20} className="text-gray-500" />;
        }
    };

    const getColorClasses = () => {
        const colors = {
            purple: 'from-purple-500/20 to-blue-500/20 border-purple-500/30',
            green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
            blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
            orange: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
        };
        return colors[color] || colors.purple;
    };

    return (
        <motion.div
            className={`
        p-5 rounded-xl border bg-gradient-to-br
        ${getColorClasses()}
        backdrop-blur-sm
      `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-white">{title}</h3>
                </div>
                {trend && getTrendIcon()}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                {description}
            </p>

            {/* Value/Metric */}
            {value && (
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{value}</span>
                    {trend && (
                        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' :
                                trend === 'down' ? 'text-red-400' :
                                    'text-gray-400'
                            }`}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                        </span>
                    )}
                </div>
            )}
        </motion.div>
    );
};

InsightCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    trend: PropTypes.oneOf(['up', 'down', 'neutral']),
    value: PropTypes.string,
    icon: PropTypes.elementType,
    color: PropTypes.oneOf(['purple', 'green', 'blue', 'orange']),
};

export default InsightCard;
