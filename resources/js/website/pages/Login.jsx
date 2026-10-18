
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/common/ToastProvider.jsx';

function Login() {
    const { user, loading, login } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    if (loading) {
        return (
            <div className="tf-auth-page d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <span className="spinner-border text-primary mb-3" />
                    <p className="text-muted mb-0">Checking your session...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return (
            <Navigate
                to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
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

        if (submitting) return;

        setSubmitting(true);

        try {
            const loggedInUser = await login(form);

            toast.success('Welcome back! You are now logged in.');

            navigate(
                loggedInUser.role === 'admin'
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
                response?.errors?.email?.[0] ||
                response?.errors?.password?.[0] ||
                response?.message ||
                'Unable to log in. Please check your credentials.'
            );
        } finally {
            setSubmitting(false);
        }
    }

    function fieldError(name) {
        if (!errors[name]?.[0]) return null;

        return (
            <div className="tf-auth-error">
                <i className="bi bi-exclamation-circle me-1" />
                {errors[name][0]}
            </div>
        );
    }

    return (
        <div className="tf-auth-page">
            <div className="tf-auth-shell">
                {/* Top header */}
                <header className="tf-auth-topbar">
                    <Link to="/" className="tf-auth-brand">
                        <span className="tf-auth-brand-icon">
                            <i className="bi bi-check-lg" />
                        </span>
                        <span>TaskFlow</span>
                    </Link>

                    <div className="tf-auth-top-link">
                        New to TaskFlow?
                        <Link to="/register">
                            Create account
                            <i className="bi bi-arrow-right ms-1" />
                        </Link>
                    </div>
                </header>

                <main className="tf-auth-content">
                    {/* Left promotional section */}
                    <section className="tf-auth-promo">
                        <div className="tf-auth-eyebrow">
                            <i className="bi bi-stars text-warning" />
                            Your productivity starts here
                        </div>

                        <h1 className="tf-auth-headline">
                            Welcome
                            <span className="tf-auth-gradient-text">
                                Back!
                            </span>
                        </h1>

                        <p className="tf-auth-description">
                            Sign in to organize your tasks, track your progress,
                            and make every day more productive with TaskFlow.
                        </p>

                        <div className="tf-auth-benefits">
                            <div className="tf-auth-benefit">
                                <span className="tf-auth-benefit-icon">
                                    <i className="bi bi-check2-circle" />
                                </span>
                                <div>
                                    <strong>Stay organized</strong>
                                    <p>Keep your tasks in one simple workspace.</p>
                                </div>
                            </div>

                            <div className="tf-auth-benefit">
                                <span className="tf-auth-benefit-icon">
                                    <i className="bi bi-graph-up-arrow" />
                                </span>
                                <div>
                                    <strong>Track your progress</strong>
                                    <p>See what you have completed and what is next.</p>
                                </div>
                            </div>

                            <div className="tf-auth-benefit">
                                <span className="tf-auth-benefit-icon">
                                    <i className="bi bi-shield-check" />
                                </span>
                                <div>
                                    <strong>Your workspace awaits</strong>
                                    <p>Sign in to continue where you left off.</p>
                                </div>
                            </div>
                        </div>

                        {/* CSS-based 3D illustration */}
                        <div className="tf-auth-visual" aria-hidden="true">
                            <div className="tf-auth-visual-ring" />

                            <span className="tf-auth-cube tf-auth-cube-one" />
                            <span className="tf-auth-cube tf-auth-cube-two" />

                            <div className="tf-auth-glass-card">
                                <div className="tf-auth-glass-card-inner">
                                    <div className="tf-auth-glass-title">
                                        <span>My Workspace</span>
                                        <i className="bi bi-three-dots" />
                                    </div>

                                    <div className="tf-auth-task">
                                        <span className="tf-auth-task-check">
                                            <i className="bi bi-check-lg" />
                                        </span>
                                        <span>Plan your day</span>
                                        <span className="tf-auth-task-dot" />
                                    </div>

                                    <div className="tf-auth-task">
                                        <span className="tf-auth-task-check">
                                            <i className="bi bi-check-lg" />
                                        </span>
                                        <span>Review your tasks</span>
                                        <span className="tf-auth-task-dot" />
                                    </div>

                                    <div className="tf-auth-task tf-auth-task-pending">
                                        <span className="tf-auth-task-check">
                                            <i className="bi bi-clock" />
                                        </span>
                                        <span>Achieve your goals</span>
                                        <span className="tf-auth-task-dot" />
                                    </div>

                                    <div className="tf-auth-progress">
                                        <div className="tf-auth-progress-label">
                                            <span>Daily progress</span>
                                            <strong>75%</strong>
                                        </div>
                                        <div className="tf-auth-progress-track">
                                            <div className="tf-auth-progress-bar" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Login form */}
                    <section className="tf-auth-form-wrap">
                        <div className="tf-auth-card">
                            <div className="tf-auth-card-header">
                                <div className="tf-auth-card-icon">
                                    <i className="bi bi-person-check" />
                                </div>

                                <h2 className="tf-auth-card-title">
                                    Sign in to TaskFlow
                                </h2>

                                <p className="tf-auth-card-subtitle">
                                    Enter your details to access your account.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>
                                {/* Email */}
                                <div className="tf-auth-field">
                                    <label
                                        htmlFor="login-email"
                                        className="tf-auth-label"
                                    >
                                        Email address
                                    </label>

                                    <div
                                        className={`tf-auth-input-group ${
                                            errors.email ? 'is-invalid' : ''
                                        }`}
                                    >
                                        <span className="tf-auth-input-icon">
                                            <i className="bi bi-envelope" />
                                        </span>

                                        <input
                                            id="login-email"
                                            name="email"
                                            type="email"
                                            className="tf-auth-input"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            autoFocus
                                            required
                                            aria-invalid={Boolean(errors.email)}
                                        />
                                    </div>

                                    {fieldError('email')}
                                </div>

                                {/* Password */}
                                <div className="tf-auth-field">
                                    <div className="d-flex align-items-center justify-content-between gap-2">
                                        <label
                                            htmlFor="login-password"
                                            className="tf-auth-label"
                                        >
                                            Password
                                        </label>

                                        {/* Add a Forgot Password route later if needed. */}
                                        <span className="tf-auth-password-hint">
                                            Keep your account secure
                                        </span>
                                    </div>

                                    <div
                                        className={`tf-auth-input-group ${
                                            errors.password ? 'is-invalid' : ''
                                        }`}
                                    >
                                        <span className="tf-auth-input-icon">
                                            <i className="bi bi-lock" />
                                        </span>

                                        <input
                                            id="login-password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            className="tf-auth-input tf-auth-password-input"
                                            placeholder="Enter your password"
                                            value={form.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                            required
                                            aria-invalid={Boolean(errors.password)}
                                        />

                                        <button
                                            type="button"
                                            className="tf-auth-password-toggle"
                                            onClick={() =>
                                                setShowPassword((current) => !current)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            }
                                        >
                                            <i
                                                className={`bi ${
                                                    showPassword
                                                        ? 'bi-eye-slash'
                                                        : 'bi-eye'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {fieldError('password')}
                                </div>

                                <button
                                    type="submit"
                                    className="tf-auth-submit"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in to your account
                                            <i className="bi bi-arrow-right" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="tf-auth-divider">
                                <span>YOUR WORKSPACE IS WAITING</span>
                            </div>

                            <p className="tf-auth-form-footer">
                                Don't have an account?{' '}
                                <Link to="/register">Create one free</Link>
                            </p>

                            <p className="tf-auth-terms">
                                <i className="bi bi-shield-lock me-1" />
                                Sign in with your registered TaskFlow credentials.
                            </p>
                        </div>
                    </section>
                </main>

                <footer className="tf-auth-footer">
                    <span>
                        © {new Date().getFullYear()} TaskFlow. All rights reserved.
                    </span>

                    <Link to="/">
                        <i className="bi bi-arrow-left me-1" />
                        Back to home
                    </Link>
                </footer>
            </div>
        </div>
    );
}

export default Login;
