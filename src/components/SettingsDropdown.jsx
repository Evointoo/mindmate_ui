import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, ChevronDown } from 'lucide-react';

function SettingsDropdown({ onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSettingsClick = () => {
        setIsOpen(false);
        navigate('/profile?tab=settings');
    };

    const handleLogoutClick = () => {
        setIsOpen(false);
        onLogout();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                title="Settings"
            >
                <div className="flex items-center gap-1">
                    <Settings size={20} className="text-white/60" strokeWidth={1.5} />
                    <ChevronDown
                        size={16}
                        className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        strokeWidth={1.5}
                    />
                </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-black-secondary/95 border border-white/10 rounded-lg shadow-xl overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="py-2">
                            {/* Settings Option */}
                            <button
                                onClick={handleSettingsClick}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                            >
                                <Settings size={18} className="text-white/60" strokeWidth={1.5} />
                                <span className="text-white text-sm">Settings</span>
                            </button>

                            {/* Divider */}
                            <div className="h-px bg-white/10 my-1"></div>

                            {/* Logout Option */}
                            <button
                                onClick={handleLogoutClick}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={18} className="text-red-400" strokeWidth={1.5} />
                                <span className="text-red-400 text-sm">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SettingsDropdown;
