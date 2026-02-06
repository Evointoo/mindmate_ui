import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { EmergencyButton } from './index';

function Layout({ user, onLogout }) {
    return (
        <div className="min-h-screen bg-black-primary">
            {/* Fixed TopBar */}
            <TopBar user={user} onLogout={onLogout} />

            {/* Sidebar (starts below header) */}
            <Sidebar onLogout={onLogout} />

            {/* Main Content */}
            <main
                className="transition-all duration-300 ease-in-out"
                style={{
                    marginLeft: '68px', // Fixed slim sidebar width
                    marginTop: '73px', // Account for fixed header
                    minHeight: 'calc(100vh - 73px)'
                }}
            >
                <Outlet />
            </main>

            {/* Emergency Button */}
            <EmergencyButton />
        </div>
    );
}

export default Layout;
