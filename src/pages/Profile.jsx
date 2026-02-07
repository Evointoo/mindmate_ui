import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, History, UserCircle } from 'lucide-react';
import TabNavigation from '../components/TabNavigation';
import ProfileOverview from './Profile/ProfileOverview';
import ProfileSettings from './Profile/ProfileSettings';
import SessionHistory from './Profile/SessionHistory';

function Profile({ user, accessToken }) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: UserCircle },
        { id: 'history', label: 'Session History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <ProfileOverview user={user} accessToken={accessToken} />;
            case 'history':
                return <SessionHistory user={user} accessToken={accessToken} />;
            case 'settings':
                return <ProfileSettings user={user} accessToken={accessToken} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen p-6">
            <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
                    <p className="text-white/60">Manage your account and view your therapy journey</p>
                </div>

                {/* Tabs */}
                <div className="glass-panel overflow-hidden">
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Tab Content */}
                    <div className="p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Profile;
