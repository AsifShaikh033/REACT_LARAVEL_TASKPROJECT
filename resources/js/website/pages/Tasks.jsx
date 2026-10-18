
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastProvider';
import '../../../css/website/Tasks.css';

const emptyForm = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
};

const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
};

function formatDate(date) {
    if (!date) return 'No deadline';

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function isOverdue(task) {
    if (!task.due_date || task.status === 'completed') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return new Date(`${task.due_date}T00:00:00`) < today;
}

function getErrorMessage(error) {
    const validationErrors = error.response?.data?.errors;

    if (validationErrors) {
        return Object.values(validationErrors).flat()[0];
    }

    return error.response?.data?.message || 'Something went wrong.';
}

function Tasks() {
    const { user, loading: authLoading } = useAuth();
    const toast = useToast();

    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [page, setPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});

    const fetchTasks = useCallback(async () => {
        if (!user) return;

        setLoading(true);

        try {
            const response = await api.get('/user/tasks', {
                params: {
                    page,
                    per_page: 9,
                    search: search || undefined,
                    status: statusFilter || undefined,
                    priority: priorityFilter || undefined,
                },
            });

            const result = response.data?.data;

            setTasks(result?.data || []);
            setPagination({
                current_page: result?.current_page || 1,
                last_page: result?.last_page || 1,
                total: result?.total || 0,
            });
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, [user, page, search, statusFilter, priorityFilter]);

    useEffect(() => {
        if (user) fetchTasks();
    }, [user, fetchTasks]);

    // Debounce the search box.
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput]);

    if (authLoading) {
        return (
            <div className="tf-tasks-loading">
                <span className="spinner-border text-primary" />
                <p>Checking your account...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const completedCount = tasks.filter(
        (task) => task.status === 'completed'
    ).length;

    const pendingCount = tasks.filter(
        (task) => task.status === 'pending'
    ).length;

    function openCreateModal() {
        setEditingTask(null);
        setForm(emptyForm);
        setFormErrors({});
        setModalOpen(true);
    }

    function openEditModal(task) {
        setEditingTask(task);
        setForm({
            title: task.title || '',
            description: task.description || '',
            priority: task.priority || 'medium',
            status: task.status || 'pending',
            due_date: task.due_date
                ? String(task.due_date).slice(0, 10)
                : '',
        });
        setFormErrors({});
        setModalOpen(true);
    }

    function closeModal() {
        if (saving) return;

        setModalOpen(false);
        setEditingTask(null);
        setForm(emptyForm);
        setFormErrors({});
    }

    function handleFormChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: '',
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setFormErrors({});

        try {
            const payload = {
                ...form,
                description: form.description.trim() || null,
                due_date: form.due_date || null,
            };

            if (editingTask) {
                await api.put(`/user/tasks/${editingTask.id}`, payload);
                toast.success('Task updated successfully.');
            } else {
                await api.post('/user/tasks', payload);
                toast.success('Task created successfully.');
            }

            setModalOpen(false);
            setEditingTask(null);
            setForm(emptyForm);

            // New tasks should appear on the first page.
            if (!editingTask && page !== 1) {
                setPage(1);
            } else {
                await fetchTasks();
            }
        } catch (error) {
            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                const errors = {};

                Object.entries(validationErrors).forEach(([key, value]) => {
                    errors[key] = value[0];
                });

                setFormErrors(errors);
            } else {
                toast.error(getErrorMessage(error));
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(task) {
        const confirmed = window.confirm(
            `Delete "${task.title}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setDeletingId(task.id);

        try {
            await api.delete(`/user/tasks/${task.id}`);
            toast.success('Task deleted successfully.');

            if (tasks.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                await fetchTasks();
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setDeletingId(null);
        }
    }

    async function handleStatusChange(task, newStatus) {
        try {
            await api.patch(`/user/tasks/${task.id}`, {
                status: newStatus,
            });

            toast.success('Task status updated.');
            await fetchTasks();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    }

    function resetFilters() {
        setSearchInput('');
        setSearch('');
        setStatusFilter('');
        setPriorityFilter('');
        setPage(1);
    }

 
    return (
        <div className="tf-workspace">
            <div className="container tf-workspace-container">

                {/* Welcome header */}
                <header className="tf-workspace-header">
                    <div>
                        <div className="tf-workspace-kicker">
                            <span className="tf-live-dot" />
                            YOUR PERSONAL WORKSPACE
                        </div>

                        <h1>
                            Let's get things <span>done.</span>
                        </h1>

                        <p>
                            Welcome back, {user.name?.split(' ')[0] || 'there'}.
                            What would you like to accomplish today?
                        </p>
                    </div>

                    <button
                        type="button"
                        className="tf-workspace-add"
                        onClick={openCreateModal}
                    >
                        <i className="bi bi-plus-lg" />
                        <span>New task</span>
                    </button>
                </header>

                {/* Summary cards */}
                <section className="tf-workspace-stats">
                    <article className="tf-workspace-stat tf-stat-total">
                        <div className="tf-workspace-stat-top">
                            <span>All matching tasks</span>
                            <span className="tf-workspace-stat-icon">
                                <i className="bi bi-layers" />
                            </span>
                        </div>
                        <strong>{pagination.total}</strong>
                        <span className="tf-workspace-stat-caption">
                            Tasks in your current view
                        </span>
                    </article>

                    <article className="tf-workspace-stat tf-stat-progress">
                        <div className="tf-workspace-stat-top">
                            <span>In progress</span>
                            <span className="tf-workspace-stat-icon">
                                <i className="bi bi-hourglass-split" />
                            </span>
                        </div>
                        <strong>
                            {tasks.filter(
                                (task) => task.status === 'in_progress'
                            ).length}
                        </strong>
                        <span className="tf-workspace-stat-caption">
                            On this page
                        </span>
                    </article>

                    <article className="tf-workspace-stat tf-stat-complete">
                        <div className="tf-workspace-stat-top">
                            <span>Completed</span>
                            <span className="tf-workspace-stat-icon">
                                <i className="bi bi-check2-circle" />
                            </span>
                        </div>
                        <strong>{completedCount}</strong>
                        <span className="tf-workspace-stat-caption">
                            On this page
                        </span>
                    </article>
                </section>

                {/* Task workspace */}
                <section className="tf-workspace-panel">

                    <div className="tf-workspace-panel-header">
                        <div>
                            <h2>My task list</h2>
                            <p>Keep your priorities clear and your day on track.</p>
                        </div>

                        <span className="tf-workspace-count">
                            {pagination.total} tasks
                        </span>
                    </div>

                    {/* Search */}
                    <div className="tf-workspace-toolbar">
                        <div className="tf-workspace-search">
                            <i className="bi bi-search" />
                            <input
                                type="search"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                                placeholder="Search your tasks..."
                                aria-label="Search tasks"
                            />

                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => setSearchInput('')}
                                    aria-label="Clear search"
                                >
                                    <i className="bi bi-x-lg" />
                                </button>
                            )}
                        </div>

                        <div className="tf-workspace-priority-filter">
                            <i className="bi bi-sliders" />
                            <select
                                value={priorityFilter}
                                onChange={(event) => {
                                    setPriorityFilter(event.target.value);
                                    setPage(1);
                                }}
                                aria-label="Filter by priority"
                            >
                                <option value="">All priorities</option>
                                <option value="high">High priority</option>
                                <option value="medium">Medium priority</option>
                                <option value="low">Low priority</option>
                            </select>
                        </div>
                    </div>

                    {/* Status filter tabs */}
                    <div className="tf-workspace-tabs">
                        {[
                            { label: 'All tasks', value: '' },
                            { label: 'To do', value: 'pending' },
                            { label: 'In progress', value: 'in_progress' },
                            { label: 'Completed', value: 'completed' },
                        ].map((tab) => (
                            <button
                                key={tab.value || 'all'}
                                type="button"
                                className={
                                    statusFilter === tab.value
                                        ? 'tf-workspace-tab active'
                                        : 'tf-workspace-tab'
                                }
                                onClick={() => {
                                    setStatusFilter(tab.value);
                                    setPage(1);
                                }}
                            >
                                {tab.label}
                                {statusFilter === tab.value && (
                                    <span className="tf-tab-active-dot" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* List header */}
                    <div className="tf-workspace-list-heading">
                        <span>Task details</span>
                        <span>Priority</span>
                        <span>Due date</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    {/* Tasks */}
                    {loading ? (
                        <div className="tf-workspace-loading">
                            <span className="spinner-border text-primary" />
                            <p>Getting your tasks ready...</p>
                        </div>
                    ) : tasks.length > 0 ? (
                        <div className="tf-workspace-task-list">
                            {tasks.map((task, index) => (
                                <article
                                    key={task.id}
                                    className={`tf-workspace-task ${
                                        task.status === 'completed'
                                            ? 'tf-workspace-task-done'
                                            : ''
                                    }`}
                                    style={{ '--task-index': index }}
                                >
                                    <div className="tf-workspace-task-main">
                                        <span
                                            className={`tf-task-marker ${
                                                task.status === 'completed'
                                                    ? 'marker-done'
                                                    : task.status === 'in_progress'
                                                    ? 'marker-progress'
                                                    : ''
                                            }`}
                                        >
                                            {task.status === 'completed' ? (
                                                <i className="bi bi-check-lg" />
                                            ) : task.status === 'in_progress' ? (
                                                <i className="bi bi-play-fill" />
                                            ) : (
                                                <i className="bi bi-circle" />
                                            )}
                                        </span>

                                        <div className="tf-workspace-task-content">
                                            <h3>{task.title}</h3>
                                            <p>
                                                {task.description ||
                                                    'No description added'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="tf-workspace-mobile-label">
                                        <span>Priority</span>
                                        <span
                                            className={`tf-workspace-priority priority-${task.priority}`}
                                        >
                                            <span />
                                            {task.priority}
                                        </span>
                                    </div>

                                    <div className="tf-workspace-task-priority">
                                        <span
                                            className={`tf-workspace-priority priority-${task.priority}`}
                                        >
                                            <span />
                                            {task.priority}
                                        </span>
                                    </div>

                                    <div className="tf-workspace-task-date">
                                        <i className="bi bi-calendar3" />
                                        <span
                                            className={
                                                isOverdue(task)
                                                    ? 'tf-workspace-overdue'
                                                    : ''
                                            }
                                        >
                                            {task.due_date
                                                ? formatDate(task.due_date)
                                                : 'No deadline'}
                                        </span>
                                        {isOverdue(task) && (
                                            <small>Overdue</small>
                                        )}
                                    </div>

                                    <div className="tf-workspace-mobile-label">
                                        <span>Status</span>
                                        <span
                                            className={`tf-workspace-status status-${task.status}`}
                                        >
                                            {statusLabels[task.status] ||
                                                task.status}
                                        </span>
                                    </div>

                                    <div className="tf-workspace-task-status">
                                        <select
                                            value={task.status}
                                            onChange={(event) =>
                                                handleStatusChange(
                                                    task,
                                                    event.target.value
                                                )
                                            }
                                            className={`tf-workspace-status-select status-${task.status}`}
                                            aria-label={`Update status of ${task.title}`}
                                        >
                                            <option value="pending">To do</option>
                                            <option value="in_progress">
                                                In progress
                                            </option>
                                            <option value="completed">
                                                Completed
                                            </option>
                                        </select>
                                    </div>

                                    <div className="tf-workspace-task-actions">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(task)}
                                            aria-label={`Edit ${task.title}`}
                                            title="Edit task"
                                        >
                                            <i className="bi bi-pencil" />
                                        </button>

                                        <button
                                            type="button"
                                            className="tf-workspace-action-delete"
                                            onClick={() => handleDelete(task)}
                                            disabled={deletingId === task.id}
                                            aria-label={`Delete ${task.title}`}
                                            title="Delete task"
                                        >
                                            {deletingId === task.id ? (
                                                <span className="spinner-border spinner-border-sm" />
                                            ) : (
                                                <i className="bi bi-trash3" />
                                            )}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="tf-workspace-empty">
                            <div className="tf-workspace-empty-art">
                                <i className="bi bi-clipboard2-check" />
                                <span><i className="bi bi-stars" /></span>
                            </div>

                            <h3>
                                {search || statusFilter || priorityFilter
                                    ? 'No tasks match your filters'
                                    : 'Your next achievement starts here'}
                            </h3>

                            <p>
                                {search || statusFilter || priorityFilter
                                    ? 'Try a different search or clear your filters to see more tasks.'
                                    : 'Add a task, set your priority, and turn your plans into progress.'}
                            </p>

                            {search || statusFilter || priorityFilter ? (
                                <button
                                    type="button"
                                    className="tf-workspace-empty-button"
                                    onClick={() => {
                                        resetFilters();
                                    }}
                                >
                                    <i className="bi bi-arrow-counterclockwise" />
                                    Clear filters
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="tf-workspace-add"
                                    onClick={openCreateModal}
                                >
                                    <i className="bi bi-plus-lg" />
                                    Create your first task
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && pagination.last_page > 1 && (
                        <div className="tf-workspace-pagination">
                            <span>
                                Page {pagination.current_page} of{' '}
                                {pagination.last_page}
                            </span>

                            <div>
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() =>
                                        setPage((current) => current - 1)
                                    }
                                >
                                    <i className="bi bi-chevron-left" />
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={page >= pagination.last_page}
                                    onClick={() =>
                                        setPage((current) => current + 1)
                                    }
                                >
                                    Next
                                    <i className="bi bi-chevron-right" />
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* Create/Edit modal */}
                {modalOpen && (
                    <div
                        className="tf-task-modal-backdrop"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                closeModal();
                            }
                        }}
                    >
                        <section
                            className="tf-task-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="tf-task-modal-title"
                        >
                            <div className="tf-task-modal-header">
                                <div>
                                    <span className="tf-task-modal-eyebrow">
                                        YOUR WORKSPACE
                                    </span>
                                    <h2 id="tf-task-modal-title">
                                        {editingTask ? 'Edit your task' : 'Create a new task'}
                                    </h2>
                                    <p>
                                        {editingTask
                                            ? 'Make changes to your task details.'
                                            : 'A little planning goes a long way.'}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="tf-task-modal-close"
                                    onClick={closeModal}
                                    disabled={saving}
                                    aria-label="Close"
                                >
                                    <i className="bi bi-x-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="tf-task-modal-body">
                                    <div className="tf-task-form-group">
                                        <label htmlFor="task-title">
                                            Task name <span>*</span>
                                        </label>
                                        <input
                                            id="task-title"
                                            name="title"
                                            value={form.title}
                                            onChange={handleFormChange}
                                            placeholder="What do you need to get done?"
                                            maxLength={255}
                                            required
                                            autoFocus
                                        />
                                        {formErrors.title && (
                                            <small className="tf-task-form-error">
                                                {formErrors.title}
                                            </small>
                                        )}
                                    </div>

                                    <div className="tf-task-form-group">
                                        <label htmlFor="task-description">
                                            Description
                                        </label>
                                        <textarea
                                            id="task-description"
                                            name="description"
                                            value={form.description}
                                            onChange={handleFormChange}
                                            placeholder="Add a few details to help you get started..."
                                            rows={3}
                                        />
                                        {formErrors.description && (
                                            <small className="tf-task-form-error">
                                                {formErrors.description}
                                            </small>
                                        )}
                                    </div>

                                    <div className="tf-task-form-row">
                                        <div className="tf-task-form-group">
                                            <label htmlFor="task-priority">
                                                Priority
                                            </label>
                                            <select
                                                id="task-priority"
                                                name="priority"
                                                value={form.priority}
                                                onChange={handleFormChange}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>

                                        <div className="tf-task-form-group">
                                            <label htmlFor="task-status">
                                                Status
                                            </label>
                                            <select
                                                id="task-status"
                                                name="status"
                                                value={form.status}
                                                onChange={handleFormChange}
                                            >
                                                <option value="pending">To do</option>
                                                <option value="in_progress">
                                                    In progress
                                                </option>
                                                <option value="completed">
                                                    Completed
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="tf-task-form-group">
                                        <label htmlFor="task-due-date">
                                            Due date
                                        </label>
                                        <input
                                            id="task-due-date"
                                            name="due_date"
                                            type="date"
                                            value={form.due_date}
                                            onChange={handleFormChange}
                                        />
                                        {formErrors.due_date && (
                                            <small className="tf-task-form-error">
                                                {formErrors.due_date}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="tf-task-modal-footer">
                                    <button
                                        type="button"
                                        className="tf-task-secondary-button"
                                        onClick={closeModal}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="tf-task-primary-button"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi ${editingTask ? 'bi-check2' : 'bi-plus-lg'}`} />
                                                {editingTask ? 'Save changes' : 'Create task'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );

}

export default Tasks;
