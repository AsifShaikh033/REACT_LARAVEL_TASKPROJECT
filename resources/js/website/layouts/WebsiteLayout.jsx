import { Outlet } from 'react-router-dom';

import WebsiteNavbar from '../components/WebsiteNavbar.jsx';
import WebsiteFooter from '../components/WebsiteFooter.jsx';

function WebsiteLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <WebsiteNavbar />

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <WebsiteFooter />
        </div>
    );
}

export default WebsiteLayout;