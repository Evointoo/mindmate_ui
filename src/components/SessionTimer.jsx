import { Clock } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * SessionTimer - Premium session duration display
 * Clean, minimal timer with professional styling
 */
const SessionTimer = ({ seconds }) => {
    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2">
            <div className="p-2 bg-white/5 rounded-lg">
                <Clock size={18} className="text-green-neon" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-mono text-white/80 tabular-nums">
                {formatTime(seconds)}
            </span>
        </div>
    );
};

SessionTimer.propTypes = {
    seconds: PropTypes.number.isRequired,
};

export default SessionTimer;
