
import { Link } from 'react-router-dom';
import {
    useWebsiteSettings,
    getWebsiteAssetUrl,
} from '../../context/WebsiteSettingsContext';

function WebsiteFooter() {
    const { settings, loading, error } = useWebsiteSettings();

    const currentYear = new Date().getFullYear();

    const websiteName = settings.website_name || 'TaskFlow';

    const logo = getWebsiteAssetUrl(settings.website_logo);

    const description =
        settings.website_description ||
        'Organize your work, focus on what matters, and turn your plans into progress.';

    const address = settings.address || '';

    // Match the actual database column names.
    const email = settings.contact_email || '';

    const phone = settings.contact_phone || '';

    const workingHours = settings.working_hours || '';

    const socialLinks = Array.isArray(settings.social_links)
        ? settings.social_links.filter((social) => social?.url)
        : [];

    const quickLinks = [
        { label: 'Home', to: '/' },
        { label: 'Features', to: '/#features' },
        { label: 'Login', to: '/login' },
        { label: 'Create Account', to: '/register' },
    ];

    return (
        <footer className="tf-website-footer">
            <div className="tf-footer-main">
                <div className="container">
                    <div className="row g-5">

                        {/* Brand and description */}
                        <div className="col-lg-4 col-md-6">
                            <Link to="/" className="tf-footer-brand">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt={`${websiteName} logo`}
                                        className="tf-footer-logo-image"
                                    />
                                ) : (
                                    <span className="tf-footer-logo-icon">
                                        <i className="bi bi-check2-square" />
                                    </span>
                                )}

                                <span className="tf-footer-brand-name">
                                    {websiteName}
                                </span>
                            </Link>

                            <p className="tf-footer-description">
                                {description}
                            </p>

                            {/* Social links */}
                            {socialLinks.length > 0 && (
                                <div className="tf-footer-socials">
                                    <span className="tf-footer-social-label">
                                        FOLLOW US
                                    </span>

                                    <div className="tf-footer-social-list">
                                        {socialLinks.map((social, index) => (
                                            <a
                                                key={`${social.platform || 'social'}-${index}`}
                                                href={social.url}
                                                className="tf-footer-social-link"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={
                                                    social.platform ||
                                                    'Social media'
                                                }
                                                title={social.platform || ''}
                                            >
                                                <i
                                                    className={`bi ${
                                                        social.icon || 'bi-globe'
                                                    }`}
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick navigation */}
                        <div className="col-6 col-lg-2 col-md-6">
                            <h3 className="tf-footer-heading">
                                Quick Links
                            </h3>

                            <ul className="tf-footer-links">
                                {quickLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link to={item.to}>
                                            <i className="bi bi-arrow-right-short" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact details */}
                        <div className="col-6 col-lg-3 col-md-6">
                            <h3 className="tf-footer-heading">
                                Contact Us
                            </h3>

                            <ul className="tf-footer-contact-list">
                                {address && (
                                    <li>
                                        <span className="tf-footer-contact-icon">
                                            <i className="bi bi-geo-alt" />
                                        </span>

                                        <span>{address}</span>
                                    </li>
                                )}

                                {email && (
                                    <li>
                                        <span className="tf-footer-contact-icon">
                                            <i className="bi bi-envelope" />
                                        </span>

                                        <a href={`mailto:${email}`}>
                                            {email}
                                        </a>
                                    </li>
                                )}

                                {phone && (
                                    <li>
                                        <span className="tf-footer-contact-icon">
                                            <i className="bi bi-telephone" />
                                        </span>

                                        <a
                                            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                                        >
                                            {phone}
                                        </a>
                                    </li>
                                )}

                                {workingHours && (
                                    <li>
                                        <span className="tf-footer-contact-icon">
                                            <i className="bi bi-clock" />
                                        </span>

                                        <span>{workingHours}</span>
                                    </li>
                                )}

                                {!address &&
                                    !email &&
                                    !phone &&
                                    !workingHours &&
                                    !loading && (
                                        <li className="tf-footer-contact-empty">
                                            Contact information will appear
                                            here.
                                        </li>
                                    )}
                            </ul>

                            {error && (
                                <small className="text-warning">
                                    Contact details are temporarily unavailable.
                                </small>
                            )}
                        </div>

                        {/* Call to action */}
                        <div className="col-lg-3 col-md-6">
                            <div className="tf-footer-cta">
                                <span className="tf-footer-cta-icon">
                                    <i className="bi bi-rocket-takeoff" />
                                </span>

                                <h3>Ready to get organized?</h3>

                                <p>
                                    Create your account and start managing
                                    your tasks with {websiteName}.
                                </p>

                                <Link
                                    to="/register"
                                    className="tf-footer-cta-button"
                                >
                                    Get Started
                                    <i className="bi bi-arrow-up-right" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Copyright bar */}
            <div className="tf-footer-bottom">
                <div className="container">
                    <div className="tf-footer-bottom-inner">
                        <p>
                            © {settings.copyright_year || currentYear}{' '}
                            <strong>{websiteName}</strong>
                            {settings.copyright_text
                                ? ` ${settings.copyright_text}`
                                : '. All rights reserved.'}
                        </p>

                        <div className="tf-footer-bottom-links">
                            {settings.privacy_url && (
                                <a
                                    href={settings.privacy_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Privacy Policy
                                </a>
                            )}

                            {settings.terms_url && (
                                <a
                                    href={settings.terms_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Terms &amp; Conditions
                                </a>
                            )}

                            <a
                                href="#top"
                                onClick={(event) => {
                                    event.preventDefault();

                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                            >
                                Back to top{' '}
                                <i className="bi bi-arrow-up" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default WebsiteFooter;
