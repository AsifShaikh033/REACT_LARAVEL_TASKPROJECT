
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/common/ToastProvider.jsx';
import {
    useWebsiteSettings,
    getWebsiteAssetUrl,
} from '../../context/WebsiteSettingsContext';



function UserAvatar({ user, large = false }) {
    const [imageFailed, setImageFailed] = useState(false);

    const avatarUrl = user?.avatar;
    const initial =
        user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

    return (
        <span
            className={`tf-user-avatar ${large ? 'tf-user-avatar-large' : ''}`}
        >
            {avatarUrl && !imageFailed ? (
                <img
                    src={avatarUrl}
                    alt={`${user?.name || 'User'} profile`}
                    onError={() => setImageFailed(true)}
                />
            ) : (
                initial
            )}
        </span>
    );
}

function WebsiteNavbar() {
    const { user, loading, logout } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const { settings } = useWebsiteSettings();
    const logoUrl = getWebsiteAssetUrl(settings.website_logo);

    const [loggingOut, setLoggingOut] = useState(false);

    const isAdmin = user?.role === 'admin';
    const dashboardPath = isAdmin ? '/admin/dashboard' : '/user/dashboard';

    async function handleLogout() {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await logout();
            toast.success('You have been logged out successfully.');
        } catch {
            toast.warning('Your session was cleared. Please sign in again.');
        } finally {
            setLoggingOut(false);
            navigate('/login', { replace: true });
        }
    }

    return (
        <nav className="navbar navbar-expand-lg tf-website-navbar sticky-top">
            <div className="container tf-navbar-container">
                {/* Brand */}
                <Link
                    className="navbar-brand tf-navbar-brand"
                    to="/"
                    aria-label={`${settings.website_name || 'TaskFlow'} home`}
                >
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={settings.website_name || 'TaskFlow'}
                            className="tf-navbar-logo"
                        />
                    ) : (
                        <span className="tf-navbar-brand-icon">
                            <i className="bi bi-check2-square" />
                        </span>
                    )}

                    <span>{settings.website_name || 'TaskFlow'}</span>
                </Link>

                {/* Mobile toggle */}
                <button
                    className="navbar-toggler tf-navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#websiteNavbar"
                    aria-controls="websiteNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                {/* Navigation */}
                <div
                    className="collapse navbar-collapse"
                    id="websiteNavbar"
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center tf-navbar-links">
                        {/* Home */}
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `nav-link tf-nav-link ${
                                        isActive ? 'active' : ''
                                    }`
                                }
                            >
                                <i className="bi bi-house-door me-2 d-lg-none" />
                                Home
                            </NavLink>
                        </li>

                        {/* Features */}
                        <li className="nav-item">
                            <a
                                className="nav-link tf-nav-link"
                                href="/#features"
                            >
                                <i className="bi bi-grid me-2 d-lg-none" />
                                Features
                            </a>
                        </li>

                        {/* Guest links */}
                        {!loading && !user && (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            `nav-link tf-nav-link ${
                                                isActive ? 'active' : ''
                                            }`
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to="/register"
                                        className="btn tf-navbar-register"
                                    >
                                        Get Started
                                        <i className="bi bi-arrow-up-right ms-2" />
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Authenticated user */}
                        {!loading && user && (
                            <li className="nav-item dropdown tf-user-dropdown">
                                <button
                                    className="tf-user-trigger dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    data-bs-auto-close="true"
                                    aria-expanded="false"
                                >
                                  <UserAvatar user={user} large />

                                    <span className="tf-user-info">
                                        <span className="tf-user-name">
                                            {user.name}
                                        </span>

                                        <span className="tf-user-role">
                                            {isAdmin
                                                ? 'Administrator'
                                                : 'My Account'}
                                        </span>
                                    </span>

                                    <i className="bi bi-chevron-down tf-user-chevron" />
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end tf-user-menu">
                                    {/* User information */}
                                    <li>
                                        <div className="tf-user-menu-header">
                                          <UserAvatar user={user} large />

                                            <div className="min-w-0">
                                                <div className="tf-user-menu-name">
                                                    {user.name}
                                                </div>

                                                <div className="tf-user-menu-email">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    {/* Dashboard */}
                                    <li>
                                        <Link
                                            className="dropdown-item tf-user-menu-item"
                                            to={dashboardPath}
                                        >
                                            <i className="bi bi-speedometer2" />

                                            <span>
                                                {isAdmin
                                                    ? 'Admin Dashboard'
                                                    : 'My Dashboard'}
                                            </span>

                                            <i className="bi bi-arrow-up-right ms-auto tf-menu-arrow" />
                                        </Link>
                                    </li>

                                    {/* My Tasks - above Logout */}
                                    <li>
                                        <NavLink
                                            className={({ isActive }) =>
                                                `dropdown-item tf-user-menu-item ${
                                                    isActive
                                                        ? 'active tf-task-menu-active'
                                                        : ''
                                                }`
                                            }
                                            to="/tasks"
                                        >
                                            <i className="bi bi-check2-square" />

                                            <span>My Tasks</span>

                                            <i className="bi bi-arrow-up-right ms-auto tf-menu-arrow" />
                                        </NavLink>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    {/* Logout */}
                                    <li>
                                        <button
                                            className="dropdown-item tf-user-menu-item tf-logout-item"
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                        >
                                            {loggingOut ? (
                                                <span className="spinner-border spinner-border-sm" />
                                            ) : (
                                                <i className="bi bi-box-arrow-right" />
                                            )}

                                            <span>
                                                {loggingOut
                                                    ? 'Logging out...'
                                                    : 'Logout'}
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        )}

                        {/* Authentication loading */}
                        {loading && (
                            <li className="nav-item tf-navbar-loading">
                                <span className="spinner-border spinner-border-sm text-primary" />
                                <span>Checking session...</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default WebsiteNavbar;
