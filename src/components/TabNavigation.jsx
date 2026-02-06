import { motion } from 'framer-motion';

function TabNavigation({ tabs, activeTab, onTabChange }) {
    return (
        <div className="border-b border-white/10">
            <div className="flex gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`relative px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-green-neon'
                            : 'text-white/60 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {tab.icon && <tab.icon size={18} strokeWidth={1.5} />}
                            <span>{tab.label}</span>
                        </div>

                        {activeTab === tab.id && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-neon"
                                layoutId="activeTab"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TabNavigation;
