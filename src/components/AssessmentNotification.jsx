import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Calendar, ArrowRight, X } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AssessmentNotification - 30-day re-assessment reminder
 * Appears as a floating notification when user needs to retake assessment
 */
function AssessmentNotification({ daysSince, onTakeAssessment, onDismiss, isVisible }) {
    if (!isVisible) return null;

    const getUrgencyLevel = (days) => {
        if (days >= 45) return 'high'; // Very overdue
        if (days >= 35) return 'medium'; // Overdue
        return 'normal'; // Due
    };

    const urgency = getUrgencyLevel(daysSince);

    const urgencyStyles = {
        high: {
            bg: 'from-red-500/20 to-orange-500/20',
            border: 'border-red-500/50',
            iconBg: 'bg-red-500/20',
            iconColor: 'text-red-400',
            buttonBg: 'bg-red-600 hover:bg-red-700',
        },
        medium: {
            bg: 'from-orange-500/20 to-yellow-500/20',
            border: 'border-orange-500/50',
            iconBg: 'bg-orange-500/20',
            iconColor: 'text-orange-400',
            buttonBg: 'bg-orange-600 hover:bg-orange-700',
        },
        normal: {
            bg: 'from-blue-500/20 to-purple-500/20',
            border: 'border-blue-500/50',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
        },
    };

    const style = urgencyStyles[urgency];

    return (
        <AnimatePresence>
            <motion.div
                className={`
          fixed top-20 right-6 max-w-md bg-gradient-to-br ${style.bg} 
          border ${style.border} rounded-xl p-4 shadow-xl z-50
          backdrop-blur-sm
        `}
                initial={{ opacity: 0, x: 100, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', damping: 20 }}
            >
                {/* Close button */}
                <button
                    onClick={onDismiss}
                    className="absolute top-3 right-3 p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Dismiss notification"
                >
                    <X size={16} className="text-gray-400" />
                </button>

                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`p-2 ${style.iconBg} rounded-lg flex-shrink-0`}>
                        <AlertCircle size={24} className={style.iconColor} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-6">
                        <h3 className="font-semibold text-white mb-1">
                            {urgency === 'high' ? 'Assessment Overdue' :
                                urgency === 'medium' ? 'Assessment Due Soon' :
                                    'Time for Re-Assessment'}
                        </h3>

                        <p className="text-sm text-gray-300 mb-3">
                            It's been <strong>{daysSince} days</strong> since your last assessment.
                            {urgency === 'high'
                                ? ' Please update your mental health profile as soon as possible.'
                                : ' Help us provide better support by updating your mental health profile.'
                            }
                        </p>

                        {/* Days indicator */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                            <Calendar size={14} />
                            <span>Last assessment: {daysSince} days ago</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={onTakeAssessment}
                                className={`
                  flex items-center gap-2 px-4 py-2 ${style.buttonBg}
                  text-white rounded-lg text-sm font-semibold transition-colors
                `}
                            >
                                Take Assessment
                                <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={onDismiss}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                                Remind Later
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Assessment frequency</span>
                        <span>Every 30 days</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${urgency === 'high' ? 'bg-red-500' :
                                    urgency === 'medium' ? 'bg-orange-500' :
                                        'bg-blue-500'
                                }`}
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.min((daysSince / 30) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

AssessmentNotification.propTypes = {
    daysSince: PropTypes.number.isRequired,
    onTakeAssessment: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
};

export default AssessmentNotification;
