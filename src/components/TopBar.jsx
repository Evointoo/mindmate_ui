import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import SettingsDropdown from './SettingsDropdown';

const QUOTES = [
    "You are stronger than you think.",
    "Every step forward is progress.",
    "Your mental health matters.",
    "It's okay to not be okay.",
    "Healing is not linear.",
    "You deserve peace and happiness.",
    "Be kind to yourself today.",
    "Your feelings are valid.",
    "Tomorrow is a new beginning.",
    "You are not alone in this journey.",
];

function TopBar({ user, onLogout }) {
    const navigate = useNavigate();
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    // Get user initials from email
    const getUserInitial = () => {
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return 'U';
    };

    // Rotate quotes every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 sand-texture header-professional"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="px-8 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
                {/* Left: MindMate Logo */}
                <div className="flex items-center">
                    <img
                        src="/logo.svg"
                        alt="MindMate"
                        className="h-10 w-auto"
                    />
                </div>

                {/* Center: Rotating Quotes */}
                <div className="flex-1 flex items-center justify-center px-12">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentQuoteIndex}
                            className="text-white/60 text-sm font-medium text-center max-w-md"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {QUOTES[currentQuoteIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Right: Actions + Profile */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors relative"
                        title="Notifications"
                    >
                        <Bell size={20} className="text-white/60" strokeWidth={1.5} />
                        {/* Notification badge */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-neon rounded-full"></span>
                    </button>

                    {/* Settings Dropdown */}
                    <SettingsDropdown onLogout={onLogout} />

                    {/* Divider */}
                    <div className="w-px h-6 bg-white/10 mx-1"></div>

                    {/* Profile Circle - Clickable to navigate to profile */}
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-green-neon/30 to-green-neon/10 border border-green-neon/30 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                        title="Go to Profile"
                    >
                        <span className="text-green-neon font-semibold text-base">
                            {getUserInitial()}
                        </span>
                    </button>
                </div>
            </div>
        </motion.header>
    );
}

export default TopBar;
