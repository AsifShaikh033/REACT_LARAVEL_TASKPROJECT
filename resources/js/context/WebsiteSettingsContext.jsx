
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import api from '../services/api';

const WebsiteSettingsContext = createContext(null);

const defaultSettings = {
    website_name: 'TaskFlow',
    website_logo: null,
    favicon: null,
    website_tagline: '',
    website_description: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    working_hours: '',
    social_links: [],
    privacy_url: '/privacy-policy',
    terms_url: '/terms-and-conditions',
    copyright_text: 'All rights reserved.',
    copyright_year: new Date().getFullYear(),
};

export function WebsiteSettingsProvider({ children }) {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/website/settings');

            if (response.data?.success && response.data?.data) {
                setSettings({
                    ...defaultSettings,
                    ...response.data.data,
                });
            } else {
                setError('Unable to load website settings.');
            }
        } catch (err) {
            console.error('Website settings error:', err);
            setError(
                err.response?.data?.message ||
                'Unable to load website settings.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const value = {
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
    };

    return (
        <WebsiteSettingsContext.Provider value={value}>
            {children}
        </WebsiteSettingsContext.Provider>
    );
}

export function useWebsiteSettings() {
    const context = useContext(WebsiteSettingsContext);

    if (!context) {
        throw new Error(
            'useWebsiteSettings must be used inside WebsiteSettingsProvider.'
        );
    }

    return context;
}

// Convert stored image paths into usable website URLs.
export function getWebsiteAssetUrl(path) {
    if (!path) return '';

    // Keep complete URLs and data URLs unchanged.
    if (/^(https?:\/\/|data:|blob:)/i.test(path)) {
        return path;
    }

    const cleanPath = path.replace(/^\/+/, '');

    // Stored example: storage/website/logo.png
    return `/${cleanPath}`;
}
