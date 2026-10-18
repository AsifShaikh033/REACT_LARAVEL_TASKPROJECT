
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastProvider';
import '../../../css/website/UserDashboard.css';


const EMPTY_PROFILE = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
};

const DEFAULT_STATS = {
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
};

const STATUS_LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
};

const PRIORITY_LABELS = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

function formatDate(value) {
    if (!value) return 'No due date';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'No due date';

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function getInitials(name) {
    return (name || 'User')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function getAvatarFallback(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || 'User'
    )}&background=edf2ff&color=4056a1&size=180`;
}

function Avatar({ src, name, size = 80, className = '' }) {
    const [imageFailed, setImageFailed] = useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [src]);

    return (
        <div
            className={`tf-dashboard-avatar ${className}`}
            style={{ width: size, height: size }}
        >
            {src && !imageFailed ? (
                <img
                    src={src}
                    alt={`${name || 'User'} profile`}
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
}

export default function UserDashboard() {
    const { user, loading: authLoading, refreshUser } = useAuth();
    const toast = useToast();

    const [dashboard, setDashboard] = useState(null);
    const [stats, setStats] = useState(DEFAULT_STATS);
    const [recentTasks, setRecentTasks] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [form, setForm] = useState(EMPTY_PROFILE);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

    const loadDashboard = useCallback(async () => {
        setPageLoading(true);
        setPageError('');

        try {
            const response = await api.get('/user/dashboard');
            const data = response.data?.data || {};

            setDashboard(data.user || null);
            setStats({
                ...DEFAULT_STATS,
                ...(data.statistics || {}),
            });
            setRecentTasks(data.recent_tasks || []);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'Unable to load your dashboard. Please try again.';

            setPageError(message);
        } finally {
            setPageLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            loadDashboard();
        } else if (!authLoading && !user) {
            setPageLoading(false);
        }
    }, [authLoading, user, loadDashboard]);

    useEffect(() => {
        return () => {
            if (avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    if (authLoading) {
        return (
            <div className="tf-dashboard-page">
                <div className="tf-dashboard-loading">
                    <div className="spinner-border text-primary" role="status" />
                    <p>Checking your account...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const profile = dashboard || user;
    const displayName = profile.name || user.name || 'User';
    const avatarUrl = profile.avatar || user.avatar || '';
    const completionRate =
        Number(stats.total) > 0
            ? Math.round((Number(stats.completed) / Number(stats.total)) * 100)
            : 0;

    const openEditModal = () => {
        setForm({
            name: profile.name || user.name || '',
            email: profile.email || user.email || '',
            password: '',
            password_confirmation: '',
        });

        setAvatarFile(null);
        setAvatarPreview(profile.avatar || user.avatar || '');
        setAvatarLoadFailed(false);
        setFormErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;

        setModalOpen(false);
        setAvatarFile(null);
        setAvatarPreview('');
        setFormErrors({});
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a JPG, PNG or WEBP image.');
            event.target.value = '';
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must not exceed 2 MB.');
            event.target.value = '';
            return;
        }

        setAvatarFile(file);
        setAvatarLoadFailed(false);

        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setFormErrors({});

        try {
            const formData = new FormData();

            formData.append('name', form.name.trim());
            formData.append('email', form.email.trim());

            if (form.password) {
                formData.append('password', form.password);
                formData.append(
                    'password_confirmation',
                    form.password_confirmation
                );
            }

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            // Method spoofing allows Laravel to process multipart form data
            // through the existing PUT /user/profile route.
            formData.append('_method', 'PUT');

            const response = await api.post('/user/profile', formData);
            const updatedUser = response.data?.data?.user;

            if (!updatedUser) {
                throw new Error('The server did not return the updated profile.');
            }

            setDashboard((previous) => ({
                ...(previous || {}),
                ...updatedUser,
            }));

            setForm({
                ...EMPTY_PROFILE,
                name: updatedUser.name || form.name,
                email: updatedUser.email || form.email,
            });

            setAvatarFile(null);
            setAvatarPreview('');
            setModalOpen(false);

            await refreshUser();

            toast.success(
                response.data?.message || 'Profile updated successfully.'
            );
        } catch (error) {
            const validationErrors = error.response?.data?.errors;

            if (error.response?.status === 422 && validationErrors) {
                setFormErrors(validationErrors);
                toast.error('Please check the highlighted fields.');
            } else {
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    'Unable to update your profile.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="tf-dashboard-page">
                <div className="tf-dashboard-loading">
                    <div className="spinner-border text-primary" role="status" />
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (pageError && !dashboard) {
        return (
            <main className="tf-dashboard-page">
                <div className="tf-dashboard-container">
                    <div className="tf-dashboard-error">
                        <i className="bi bi-exclamation-circle" />
                        <h3>Dashboard unavailable</h3>
                        <p>{pageError}</p>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={loadDashboard}
                        >
                            <i className="bi bi-arrow-clockwise me-2" />
                            Try again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="tf-dashboard-page">
            <div className="tf-dashboard-container">
                {/* Page heading */}
                <header className="tf-dashboard-heading">
                    <div>
                        <div className="tf-dashboard-eyebrow">
                            <span className="tf-dashboard-eyebrow-dot" />
                            YOUR WORKSPACE
                        </div>

                        <h1>
                            Welcome back,{' '}
                            <span>{displayName.split(' ')[0]}</span>
                        </h1>

                        <p>
                            Here is an overview of your account and task
                            progress.
                        </p>
                    </div>

                    <Link to="/tasks" className="tf-dashboard-primary-btn">
                        <i className="bi bi-plus-lg" />
                        <span>View My Tasks</span>
                    </Link>
                </header>

                {/* Profile overview */}
                <section className="tf-dashboard-profile-card">
                    <div className="tf-dashboard-profile-main">
                        <div className="tf-dashboard-avatar-wrap">
                            <Avatar
                                src={avatarUrl}
                                name={displayName}
                                size={94}
                            />
                            <span
                                className="tf-dashboard-online-dot"
                                title="Account active"
                            />
                        </div>

                        <div className="tf-dashboard-profile-info">
                            <div className="tf-dashboard-profile-title">
                                <h2>{displayName}</h2>
                                <span className="tf-dashboard-role">
                                    <i className="bi bi-person-check-fill" />
                                    {profile.role || user.role || 'User'}
                                </span>
                            </div>

                            <p className="tf-dashboard-profile-email">
                                <i className="bi bi-envelope" />
                                {profile.email || user.email}
                            </p>

                            <p className="tf-dashboard-profile-caption">
                                <i className="bi bi-shield-check" />
                                TaskFlow member
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="tf-dashboard-edit-btn"
                        onClick={openEditModal}
                    >
                        <i className="bi bi-pencil-square" />
                        <span>Edit Profile</span>
                    </button>
                </section>

                {/* Task statistics */}
                <section className="tf-dashboard-section">
                    <div className="tf-dashboard-section-heading">
                        <div>
                            <h2>Task Overview</h2>
                            <p>Track your productivity at a glance.</p>
                        </div>

                        <Link to="/tasks" className="tf-dashboard-text-link">
                            Manage tasks <i className="bi bi-arrow-right" />
                        </Link>
                    </div>

                    <div className="tf-dashboard-stats-grid">
                        <article className="tf-dashboard-stat-card stat-total">
                            <div className="tf-dashboard-stat-top">
                                <span className="tf-dashboard-stat-icon">
                                    <i className="bi bi-grid-1x2" />
                                </span>
                                <span className="tf-dashboard-stat-label">
                                    All Tasks
                                </span>
                            </div>
                            <strong>{stats.total}</strong>
                            <p>Tasks in your workspace</p>
                        </article>

                        <article className="tf-dashboard-stat-card stat-pending">
                            <div className="tf-dashboard-stat-top">
                                <span className="tf-dashboard-stat-icon">
                                    <i className="bi bi-hourglass-split" />
                                </span>
                                <span className="tf-dashboard-stat-label">
                                    Pending
                                </span>
                            </div>
                            <strong>{stats.pending}</strong>
                            <p>Waiting to be started</p>
                        </article>

                        <article className="tf-dashboard-stat-card stat-progress">
                            <div className="tf-dashboard-stat-top">
                                <span className="tf-dashboard-stat-icon">
                                    <i className="bi bi-arrow-repeat" />
                                </span>
                                <span className="tf-dashboard-stat-label">
                                    In Progress
                                </span>
                            </div>
                            <strong>{stats.in_progress}</strong>
                            <p>Currently being worked on</p>
                        </article>

                        <article className="tf-dashboard-stat-card stat-completed">
                            <div className="tf-dashboard-stat-top">
                                <span className="tf-dashboard-stat-icon">
                                    <i className="bi bi-check2-circle" />
                                </span>
                                <span className="tf-dashboard-stat-label">
                                    Completed
                                </span>
                            </div>
                            <strong>{stats.completed}</strong>
                            <p>Successfully finished</p>
                        </article>
                    </div>
                </section>

                {/* Progress and account information */}
                <section className="tf-dashboard-lower-grid">
                    <article className="tf-dashboard-panel tf-dashboard-progress-panel">
                        <div className="tf-dashboard-panel-heading">
                            <div>
                                <h2>Completion Progress</h2>
                                <p>Your overall task completion rate</p>
                            </div>
                            <span className="tf-dashboard-progress-icon">
                                <i className="bi bi-graph-up-arrow" />
                            </span>
                        </div>

                        <div className="tf-dashboard-progress-summary">
                            <strong>{completionRate}%</strong>
                            <span>
                                {stats.completed} of {stats.total} tasks
                            </span>
                        </div>

                        <div
                            className="tf-dashboard-progress-track"
                            role="progressbar"
                            aria-valuenow={completionRate}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-label="Task completion progress"
                        >
                            <div
                                className="tf-dashboard-progress-bar"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>

                        <div className="tf-dashboard-progress-footer">
                            <span>
                                <i className="bi bi-check-circle-fill" />
                                Completed
                            </span>
                            <span>{completionRate}%</span>
                        </div>

                        {stats.total === 0 && (
                            <div className="tf-dashboard-progress-empty">
                                Create your first task to start tracking
                                your progress.
                            </div>
                        )}
                    </article>

                    <article className="tf-dashboard-panel">
                        <div className="tf-dashboard-panel-heading">
                            <div>
                                <h2>Account Information</h2>
                                <p>Your profile details</p>
                            </div>
                            <span className="tf-dashboard-account-icon">
                                <i className="bi bi-person-vcard" />
                            </span>
                        </div>

                        <div className="tf-dashboard-account-list">
                            <div className="tf-dashboard-account-item">
                                <span className="tf-dashboard-account-symbol">
                                    <i className="bi bi-person" />
                                </span>
                                <div>
                                    <small>Full Name</small>
                                    <strong>{displayName}</strong>
                                </div>
                            </div>

                            <div className="tf-dashboard-account-item">
                                <span className="tf-dashboard-account-symbol">
                                    <i className="bi bi-envelope" />
                                </span>
                                <div>
                                    <small>Email Address</small>
                                    <strong>{profile.email || user.email}</strong>
                                </div>
                            </div>

                            <div className="tf-dashboard-account-item">
                                <span className="tf-dashboard-account-symbol">
                                    <i className="bi bi-shield-check" />
                                </span>
                                <div>
                                    <small>Account Role</small>
                                    <strong>{profile.role || user.role || 'User'}</strong>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="tf-dashboard-account-edit"
                            onClick={openEditModal}
                        >
                            Update your profile
                            <i className="bi bi-arrow-up-right" />
                        </button>
                    </article>
                </section>

                {/* Recent tasks */}
                <section className="tf-dashboard-panel tf-dashboard-recent-panel">
                    <div className="tf-dashboard-section-heading">
                        <div>
                            <h2>Recent Tasks</h2>
                            <p>Your latest updated tasks</p>
                        </div>

                        <Link to="/tasks" className="tf-dashboard-text-link">
                            View all tasks <i className="bi bi-arrow-right" />
                        </Link>
                    </div>

                    {recentTasks.length > 0 ? (
                        <div className="tf-dashboard-recent-list">
                            {recentTasks.map((task) => (
                                <div
                                    className="tf-dashboard-task-row"
                                    key={task.id}
                                >
                                    <div className="tf-dashboard-task-symbol">
                                        <i className="bi bi-list-check" />
                                    </div>

                                    <div className="tf-dashboard-task-details">
                                        <h3>{task.title}</h3>
                                        <p>
                                            <i className="bi bi-calendar3" />
                                            Due {formatDate(task.due_date)}
                                        </p>
                                    </div>

                                    <span
                                        className={`tf-dashboard-priority priority-${
                                            task.priority || 'medium'
                                        }`}
                                    >
                                        {PRIORITY_LABELS[task.priority] ||
                                            task.priority ||
                                            'Medium'}
                                    </span>

                                    <span
                                        className={`tf-dashboard-status status-${
                                            task.status || 'pending'
                                        }`}
                                    >
                                        {STATUS_LABELS[task.status] ||
                                            task.status ||
                                            'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="tf-dashboard-empty">
                            <div className="tf-dashboard-empty-icon">
                                <i className="bi bi-clipboard2-check" />
                            </div>
                            <h3>No tasks yet</h3>
                            <p>
                                Your tasks will appear here once you create
                                them.
                            </p>
                            <Link to="/tasks" className="tf-dashboard-primary-btn">
                                <i className="bi bi-plus-lg" />
                                Create or view tasks
                            </Link>
                        </div>
                    )}
                </section>
            </div>

            {/* Edit profile modal */}
            {modalOpen && (
                <div
                    className="tf-dashboard-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <section
                        className="tf-dashboard-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tf-edit-profile-title"
                    >
                        <header className="tf-dashboard-modal-header">
                            <div>
                                <span className="tf-dashboard-modal-eyebrow">
                                    ACCOUNT SETTINGS
                                </span>
                                <h2 id="tf-edit-profile-title">
                                    Edit Profile
                                </h2>
                                <p>Update your personal details and photo.</p>
                            </div>

                            <button
                                type="button"
                                className="tf-dashboard-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close edit profile"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit}>
                            <div className="tf-dashboard-modal-body">
                                {/* Avatar upload */}
                                <div className="tf-dashboard-avatar-editor">
                                    <div className="tf-dashboard-avatar-editor-image">
                                        {avatarPreview && !avatarLoadFailed ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Profile preview"
                                                onError={() =>
                                                    setAvatarLoadFailed(true)
                                                }
                                            />
                                        ) : (
                                            <span>
                                                {getInitials(form.name)}
                                            </span>
                                        )}

                                        <label
                                            htmlFor="tf-profile-avatar"
                                            className="tf-dashboard-avatar-camera"
                                            title="Choose profile image"
                                        >
                                            <i className="bi bi-camera-fill" />
                                        </label>
                                    </div>

                                    <div className="tf-dashboard-avatar-editor-text">
                                        <strong>Profile photo</strong>
                                        <span>
                                            Choose a photo that represents you.
                                        </span>

                                        <label
                                            htmlFor="tf-profile-avatar"
                                            className="tf-dashboard-upload-link"
                                        >
                                            <i className="bi bi-upload" />
                                            Upload image
                                        </label>

                                        <input
                                            id="tf-profile-avatar"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="tf-dashboard-file-input"
                                            onChange={handleAvatarChange}
                                        />

                                        <small>JPG, PNG or WEBP · Max 2 MB</small>

                                        {formErrors.avatar && (
                                            <span className="tf-dashboard-field-error">
                                                {formErrors.avatar[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="tf-dashboard-form-divider" />

                                <div className="tf-dashboard-form-group">
                                    <label htmlFor="tf-profile-name">
                                        Full Name
                                    </label>
                                    <div className="tf-dashboard-input-wrap">
                                        <i className="bi bi-person" />
                                        <input
                                            id="tf-profile-name"
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleFormChange}
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                            required
                                            maxLength={255}
                                        />
                                    </div>
                                    {formErrors.name && (
                                        <span className="tf-dashboard-field-error">
                                            {formErrors.name[0]}
                                        </span>
                                    )}
                                </div>

                                <div className="tf-dashboard-form-group">
                                    <label htmlFor="tf-profile-email">
                                        Email Address
                                    </label>
                                    <div className="tf-dashboard-input-wrap">
                                        <i className="bi bi-envelope" />
                                        <input
                                            id="tf-profile-email"
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleFormChange}
                                            placeholder="Enter your email address"
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                    {formErrors.email && (
                                        <span className="tf-dashboard-field-error">
                                            {formErrors.email[0]}
                                        </span>
                                    )}
                                </div>

                                <div className="tf-dashboard-password-heading">
                                    <div>
                                        <h3>Change Password</h3>
                                        <p>
                                            Leave these fields blank to keep
                                            your current password.
                                        </p>
                                    </div>
                                    <i className="bi bi-lock" />
                                </div>

                                <div className="tf-dashboard-form-group">
                                    <label htmlFor="tf-profile-password">
                                        New Password
                                    </label>
                                    <div className="tf-dashboard-input-wrap">
                                        <i className="bi bi-lock" />
                                        <input
                                            id="tf-profile-password"
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleFormChange}
                                            placeholder="At least 8 characters"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    {formErrors.password && (
                                        <span className="tf-dashboard-field-error">
                                            {formErrors.password[0]}
                                        </span>
                                    )}
                                </div>

                                <div className="tf-dashboard-form-group">
                                    <label htmlFor="tf-profile-password-confirmation">
                                        Confirm New Password
                                    </label>
                                    <div className="tf-dashboard-input-wrap">
                                        <i className="bi bi-shield-lock" />
                                        <input
                                            id="tf-profile-password-confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={form.password_confirmation}
                                            onChange={handleFormChange}
                                            placeholder="Repeat your new password"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <footer className="tf-dashboard-modal-footer">
                                <button
                                    type="button"
                                    className="tf-dashboard-cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="tf-dashboard-save-btn"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                aria-hidden="true"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </footer>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}
