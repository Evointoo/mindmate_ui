import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ChatBubble - Premium message display for transcript
 * Clean, minimal design with professional styling
 */
const ChatBubble = ({ role, content, timestamp, avatarUrl }) => {
    const isUser = role === 'user';

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <motion.div
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Avatar */}
            <div className={`
        flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden
        ${isUser ? 'bg-green-neon/20 border border-green-neon/30' : 'bg-white/5 border border-white/10'}
      `}>
                {isUser ? (
                    <User size={16} className="text-green-neon" strokeWidth={1.5} />
                ) : (
                    avatarUrl ? (
                        <img src={avatarUrl} alt="MindMate" className="w-full h-full object-cover" />
                    ) : (
                        <img src="/favicon.svg" alt="MindMate" className="w-5 h-5 object-contain" />
                    )
                )}
            </div>

            {/* Message content */}
            <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
                <div className={`
          inline-block max-w-[85%] p-4 rounded-xl backdrop-blur-md
          ${isUser
                        ? 'bg-green-neon/30 border-2 border-green-neon/50 shadow-lg shadow-green-neon/20'
                        : 'bg-white/15 border-2 border-white/30 shadow-lg'
                    }
        `}>
                    <p className={`text-base leading-relaxed ${isUser ? 'text-white font-semibold' : 'text-white font-medium'}`}>
                        {content}
                    </p>
                </div>

                {timestamp && (
                    <p className="text-xs text-white/50 mt-2 font-medium">
                        {formatTime(timestamp)}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

ChatBubble.propTypes = {
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    avatarUrl: PropTypes.string,
};

export default ChatBubble;
