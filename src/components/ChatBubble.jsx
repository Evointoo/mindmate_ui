import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ChatBubble - Premium message display for transcript
 * Clean, minimal design with professional styling
 */
const ChatBubble = ({ role, content, timestamp }) => {
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
        flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
        ${isUser ? 'bg-green-neon/20 border border-green-neon/30' : 'bg-white/5 border border-white/10'}
      `}>
                {isUser ? (
                    <User size={16} className="text-green-neon" strokeWidth={1.5} />
                ) : (
                    <Bot size={16} className="text-white/60" strokeWidth={1.5} />
                )}
            </div>

            {/* Message content */}
            <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
                <div className={`
          inline-block max-w-[85%] p-3 rounded-lg
          ${isUser
                        ? 'bg-green-neon/10 border border-green-neon/20'
                        : 'bg-white/5 border border-white/10'
                    }
        `}>
                    <p className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-white/90'}`}>
                        {content}
                    </p>
                </div>

                {timestamp && (
                    <p className="text-xs text-white/30 mt-1">
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
};

export default ChatBubble;
