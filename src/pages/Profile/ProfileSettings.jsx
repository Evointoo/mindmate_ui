import { motion } from 'framer-motion';
import { Bell, Moon, Lock, Globe } from 'lucide-react';

function ProfileSettings({ user, accessToken }) {
    return (
        <div className="space-y-6">
            {/* Notification Settings */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell size={20} className="text-green-neon" strokeWidth={1.5} />
                    Notifications
                </h3>
                <div className="space-y-3">
                    <SettingToggle
                        label="Chat Reminders"
                        description="Get reminded to check in with yourself"
                        defaultChecked={true}
                    />
                    <SettingToggle
                        label="Mood Tracking Alerts"
                        description="Daily prompts to log your mood"
                        defaultChecked={false}
                    />
                    <SettingToggle
                        label="Progress Updates"
                        description="Weekly summaries of your mental health journey"
                        defaultChecked={true}
                    />
                </div>
            </div>

            {/* Appearance */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Moon size={20} className="text-green-neon" strokeWidth={1.5} />
                    Appearance
                </h3>
                <div className="space-y-3">
                    <SettingSelect
                        label="Theme"
                        options={[
                            { value: 'dark', label: 'Dark Mode' },
                            { value: 'light', label: 'Light Mode' },
                            { value: 'auto', label: 'Auto' },
                        ]}
                        defaultValue="dark"
                    />
                    <SettingSelect
                        label="Default Chat Mode"
                        options={[
                            { value: 'voice', label: 'Voice Chat' },
                            { value: 'chat', label: 'Text Chat' },
                            { value: 'ask', label: 'Ask Every Time' },
                        ]}
                        defaultValue="ask"
                    />
                </div>
            </div>

            {/* Privacy */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-green-neon" strokeWidth={1.5} />
                    Privacy & Security
                </h3>
                <div className="space-y-3">
                    <SettingToggle
                        label="Save Conversation History"
                        description="Store your conversations for future reference"
                        defaultChecked={true}
                    />
                    <SettingToggle
                        label="Anonymous Analytics"
                        description="Help us improve by sharing anonymous usage data"
                        defaultChecked={false}
                    />
                </div>
            </div>

            {/* Language */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-green-neon" strokeWidth={1.5} />
                    Language & Region
                </h3>
                <div className="space-y-3">
                    <SettingSelect
                        label="Language"
                        options={[
                            { value: 'en', label: 'English' },
                            { value: 'hi', label: 'Hindi' },
                            { value: 'ta', label: 'Tamil' },
                        ]}
                        defaultValue="en"
                    />
                </div>
            </div>
        </div>
    );
}

function SettingToggle({ label, description, defaultChecked }) {
    return (
        <div className="glass-panel p-4 flex items-center justify-between">
            <div>
                <p className="text-white font-medium">{label}</p>
                <p className="text-sm text-white/40">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-neon"></div>
            </label>
        </div>
    );
}

function SettingSelect({ label, options, defaultValue }) {
    return (
        <div className="glass-panel p-4">
            <label className="block text-white font-medium mb-2">{label}</label>
            <select
                defaultValue={defaultValue}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-neon/50 cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ProfileSettings;
