import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, BarChart3, Wind } from 'lucide-react';

function Sidebar() {
    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/exercises', icon: Wind, label: 'Exercises' },
    ];

    return (
        <motion.aside
            className="fixed left-0 h-screen bg-black-primary/60 backdrop-blur-sm border-r border-white/5 flex flex-col z-40"
            style={{
                width: '68px',
                top: '73px' // Start below header
            }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
        >
            {/* Navigation */}
            <nav className="flex-1 flex flex-col items-center py-6 gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-12 h-12 flex items-center justify-center rounded-lg transition-all relative group ${isActive
                                ? 'bg-white/10 text-white'
                                : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                            }`
                        }
                        title={item.label}
                    >
                        <item.icon size={22} strokeWidth={1.5} />

                        {/* Tooltip */}
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-black-secondary/95 backdrop-blur-sm border border-white/10 rounded-md text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                            {item.label}
                        </div>
                    </NavLink>
                ))}
            </nav>
        </motion.aside>
    );
}

export default Sidebar;
