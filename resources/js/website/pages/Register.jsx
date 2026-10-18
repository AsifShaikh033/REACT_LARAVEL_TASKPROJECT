
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/common/ToastProvider.jsx';

function Register() {
    const { user, loading, register } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (loading) {
        return (
            <div className="tf-auth-page d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" />
                    <p className="text-muted mt-3">Preparing TaskFlow...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return (
            <Navigate
                to={
                    user.role === 'admin'
                        ? '/admin/dashboard'
                        : '/user/dashboard'
                }
                replace
            />
        );
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: undefined,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrors({});

        if (form.password !== form.password_confirmation) {
            setErrors({
                password_confirmation: ['Passwords do not match.'],
            });

            toast.error('Your passwords do not match.');
            return;
        }

        setSubmitting(true);

        try {
            const registeredUser = await register(form);

            toast.success('Welcome to TaskFlow! Your account is ready.');

            navigate(
                registeredUser.role === 'admin'
                    ? '/admin/dashboard'
                    : '/user/dashboard',
                { replace: true }
            );
        } catch (error) {
            const response = error.response?.data;

            if (response?.errors) {
                setErrors(response.errors);
            }

            toast.error(
                response?.message ||
                'Registration failed. Please check your details.'
            );
        } finally {
            setSubmitting(false);
        }
    }

    const fieldError = (name) =>
        errors[name]?.[0] ? (
            <div className="tf-auth-error">{errors[name][0]}</div>
        ) : null;

    return (
        <div className="tf-auth-page">
            <div className="tf-auth-shell">

                {/* Top Navigation */}
                <header className="tf-auth-topbar">
                    <Link to="/" className="tf-auth-brand">
                        <span className="tf-auth-brand-icon">
                            <i className="bi bi-check-lg" />
                        </span>

                        <span>TaskFlow</span>
                    </Link>

                    <div className="tf-auth-top-link">
                        Already have an account?
                        <Link to="/login">
                            Login <i className="bi bi-arrow-right ms-1" />
                        </Link>
                    </div>
                </header>

                <main className="tf-auth-content">

                    {/* Left Promotional Section */}
                    <section className="tf-auth-promo">
                        <div className="tf-auth-eyebrow">
                            <i className="bi bi-stars text-warning" />
                            Start your productivity journey
                        </div>

                        <h1 className="tf-auth-headline">
                            Create Your
                            <span className="tf-auth-gradient-text">
                                Account
                            </span>
                        </h1>

                        <p className="tf-auth-description">
                            Join TaskFlow to organize your work, manage
                            your tasks, and achieve more with a smarter
                            workflow.
                        </p>

                        <div className="tf-auth-benefits">
                            <div className="tf-auth-benefit">
                                <div className="tf-auth-benefit-icon">
                                    <i className="bi bi-lightning-charge-fill" />
                                </div>

                                <div>
                                    <h3>Fast & Easy Setup</h3>
                                    <p>Get started in just a few moments.</p>
                                </div>
                            </div>

                            <div className="tf-auth-benefit">
                                <div className="tf-auth-benefit-icon">
                                    <i className="bi bi-shield-lock-fill" />
                                </div>

                                <div>
                                    <h3>Secure & Private</h3>
                                    <p>Your account is protected by authentication.</p>
                                </div>
                            </div>

                            <div className="tf-auth-benefit">
                                <div className="tf-auth-benefit-icon">
                                    <i className="bi bi-bar-chart-fill" />
                                </div>

                                <div>
                                    <h3>Boost Productivity</h3>
                                    <p>Turn your plans into progress.</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating 3D CSS Illustration */}
                        <div className="tf-auth-visual" aria-hidden="true">
                            <div className="tf-auth-visual-ring" />

                            <span className="tf-auth-cube tf-auth-cube-one" />
                            <span className="tf-auth-cube tf-auth-cube-two" />

                            <div className="tf-auth-glass-card">
                                <div className="tf-auth-glass-card-inner">
                                    <div className="tf-auth-glass-title">
                                        <i className="bi bi-check2-square me-2" />
                                        My Tasks
                                    </div>

                                    <div className="tf-auth-task">
                                        <i className="bi bi-check-circle-fill" />
                                        <span>Plan project</span>
                                    </div>

                                    <div className="tf-auth-task">
                                        <i className="bi bi-check-circle-fill text-success" />
                                        <span>Review tasks</span>
                                    </div>

                                    <div className="tf-auth-task">
                                        <i className="bi bi-circle" />
                                        <span>Track progress</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Registration Card */}
                    <section className="tf-auth-form-wrap">
                        <div className="tf-auth-card">
                            <div className="tf-auth-card-header">
                                <div className="tf-auth-card-icon">
                                    <i className="bi bi-person-plus-fill" />
                                </div>

                                <h2 className="tf-auth-card-title">
                                    Create Account
                                </h2>

                                <p className="tf-auth-card-subtitle">
                                    Get started with TaskFlow today.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>

                                {/* Name */}
                                <div className="tf-auth-field">
                                    <label
                                        className="tf-auth-label"
                                        htmlFor="register-name"
                                    >
                                        Full Name
                                    </label>

                                    <div className={`tf-auth-input-group ${errors.name ? 'is-invalid' : ''}`}>
                                        <span className="tf-auth-input-icon">
                                            <i className="bi bi-person" />
                                        </span>

                                        <input
                                            id="register-name"
                                            name="name"
                                            type="text"
                                            className="tf-auth-input"
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            maxLength={255}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {fieldError('name')}
                                </div>

                                {/* Email */}
                                <div className="tf-auth-field">
                                    <label
                                        className="tf-auth-label"
                                        htmlFor="register-email"
                                    >
                                        Email Address
                                    </label>

                                    <div className={`tf-auth-input-group ${errors.email ? 'is-invalid' : ''}`}>
                                        <span className="tf-auth-input-icon">
                                            <i className="bi bi-envelope" />
                                        </span>

                                        <input
                                            id="register-email"
                                            name="email"
                                            type="email"
                                            className="tf-auth-input"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            maxLength={255}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {fieldError('email')}
                                </div>

                                {/* Password */}
                                <div className="tf-auth-field">
                                    <label
                                        className="tf-auth-label"
                                        htmlFor="register-password"
                                    >
                                        Password
                                    </label>

                                    <div className={`tf-auth-input-group ${errors.password ? 'is-invalid' : ''}`}>
                                        <span className="tf-auth-input-icon">
                                            <i className="bi bi-lock" />
                                        </span>

                                        <input
                                            id="register-password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            className="tf-auth-input"
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            value={form.password}
                                            onChange={handleChange}
                                            minLength={8}
                                            required
                                            disabled={submitting}
                                        />

                                        <button
                                            type="button"
                                            className="tf-auth-password-toggle"
                                            onClick={() =>
                                                setShowPassword((value) => !value)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            }
                                            disabled={submitting}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                                        </button>
                                    </div>

                                    <div className="tf-auth-hint">
                                        Use at least 8 characters.
                                    </div>

                                    {fieldError('password')}
                                </div>

                                {/* Confirm Password */}
                                <div className="tf-auth-field">
                                    <label
                                        className="tf-auth-label"
                                        htmlFor="register-confirm-password"
                                    >
                                        Confirm Password
                                    </label>

                                    <div className={`tf-auth-input-group ${errors.password_confirmation ? 'is-invalid' : ''}`}>
                                        <span className="tf-auth-input-icon">
                                            <i className="bi bi-shield-lock" />
                                        </span>

                                        <input
                                            id="register-confirm-password"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="tf-auth-input"
                                            placeholder="Confirm your password"
                                            autoComplete="new-password"
                                            value={form.password_confirmation}
                                            onChange={handleChange}
                                            minLength={8}
                                            required
                                            disabled={submitting}
                                        />

                                        <button
                                            type="button"
                                            className="tf-auth-password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword((value) => !value)
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? 'Hide confirm password'
                                                    : 'Show confirm password'
                                            }
                                            disabled={submitting}
                                        >
                                            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                                        </button>
                                    </div>

                                    {fieldError('password_confirmation')}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="tf-auth-submit"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                aria-hidden="true"
                                            />
                                            Creating your account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <i className="bi bi-arrow-right" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="tf-auth-form-footer">
                                Already registered?{' '}
                                <Link to="/login">Sign in</Link>
                            </p>

                            <p className="tf-auth-terms">
                                Your account will be created with the
                                standard user role. Account permissions
                                are managed securely by TaskFlow.
                            </p>
                        </div>
                    </section>
                </main>

                <footer className="tf-auth-footer">
                    © {new Date().getFullYear()} TaskFlow. All rights reserved.
                </footer>
            </div>
        </div>
    );
}

export default Register;
