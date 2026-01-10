import { useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ChatInputBox - Text input with send and microphone buttons for chat mode
 * Auto-expanding textarea with keyboard shortcuts
 */
const ChatInputBox = ({ value, onChange, onSend, onVoiceClick, disabled, placeholder }) => {
    const textareaRef = useRef(null);

    // Auto-resize textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 120); // Max 5 lines (~120px)
            textarea.style.height = `${newHeight}px`;
        }
    }, [value]);

    const handleKeyDown = (e) => {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled) {
                onSend();
            }
        }
    };

    const handleSendClick = () => {
        if (value.trim() && !disabled) {
            onSend();
        }
    };

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto flex items-end gap-3">
                {/* Microphone Button */}
                <button
                    onClick={onVoiceClick}
                    disabled={disabled}
                    className="flex-shrink-0 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-green-neon/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    aria-label="Record voice message"
                    title="Record voice message"
                >
                    <Mic
                        size={20}
                        className="text-white/60 group-hover:text-green-neon transition-colors"
                        strokeWidth={1.5}
                    />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        placeholder={placeholder || 'Type your message... (Enter to send, Shift+Enter for new line)'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 resize-none focus:outline-none focus:border-green-neon/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={1}
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />

                    {/* Character count (optional) */}
                    {value.length > 0 && (
                        <div className="absolute bottom-2 right-2 text-xs text-white/30">
                            {value.length}
                        </div>
                    )}
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSendClick}
                    disabled={!value.trim() || disabled}
                    className="flex-shrink-0 p-3 bg-green-neon/20 border border-green-neon/30 rounded-xl hover:bg-green-neon/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                    aria-label="Send message"
                    title="Send message"
                >
                    <Send
                        size={20}
                        className="text-green-neon"
                        strokeWidth={1.5}
                    />
                </button>
            </div>

            {/* Hint text */}
            <div className="max-w-4xl mx-auto mt-2 text-center">
                <p className="text-white/30 text-xs">
                    Press Enter to send • Shift+Enter for new line • Click mic to record voice
                </p>
            </div>
        </div>
    );
};

ChatInputBox.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
    onVoiceClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
};

ChatInputBox.defaultProps = {
    disabled: false,
    placeholder: 'Type your message...',
};

export default ChatInputBox;
