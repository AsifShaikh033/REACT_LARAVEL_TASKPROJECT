import { Outlet } from 'react-router-dom';

import WebsiteNavbar from '../components/WebsiteNavbar.jsx';
import WebsiteFooter from '../components/WebsiteFooter.jsx';
import { WebsiteSettingsProvider } from '../../context/WebsiteSettingsContext';

function WebsiteLayout() {
    return (
        <WebsiteSettingsProvider>
        <div className="d-flex flex-column min-vh-100">
            <WebsiteNavbar />

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <WebsiteFooter />
        </div>
        </WebsiteSettingsProvider>
    );
}

export default WebsiteLayout;