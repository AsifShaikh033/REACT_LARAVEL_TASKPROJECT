import { Link } from 'react-router-dom';

function Home() {
    return (
        <>
            <section className="py-5">
                <div className="container py-lg-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7">
                            <span className="badge rounded-pill bg-primary-subtle text-primary mb-3 px-3 py-2">
                                <i className="bi bi-stars me-2"></i>
                                Simple task management
                            </span>

                            <h1 className="display-4 fw-bold mb-4">
                                Manage your tasks.
                                <span className="text-primary">
                                    {' '}Achieve more.
                                </span>
                            </h1>

                            <p className="fs-5 text-secondary mb-4">
                                Plan your work, organize your priorities,
                                and keep track of your progress with TaskFlow.
                            </p>

                            <div className="d-flex flex-wrap gap-3">
                                <Link
                                    to="/register"
                                    className="btn btn-primary btn-lg"
                                >
                                    Get Started
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </Link>

                                <Link
                                    to="/login"
                                    className="btn btn-outline-primary btn-lg"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="tf-card p-4 p-md-5">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <h5 className="fw-bold mb-0">
                                        My Tasks
                                    </h5>

                                    <i className="bi bi-three-dots fs-4 text-muted"></i>
                                </div>

                                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded mb-3">
                                    <i className="bi bi-check-circle-fill text-success fs-4"></i>

                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">
                                            Create project plan
                                        </div>
                                        <small className="text-muted">
                                            Planning
                                        </small>
                                    </div>

                                    <span className="tf-badge tf-badge-success">
                                        Done
                                    </span>
                                </div>

                                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded mb-3">
                                    <i className="bi bi-circle text-primary fs-4"></i>

                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">
                                            Review project tasks
                                        </div>
                                        <small className="text-muted">
                                            Development
                                        </small>
                                    </div>

                                    <span className="tf-badge tf-badge-primary">
                                        Active
                                    </span>
                                </div>

                                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                                    <i className="bi bi-circle text-muted fs-4"></i>

                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">
                                            Prepare weekly report
                                        </div>
                                        <small className="text-muted">
                                            Reporting
                                        </small>
                                    </div>

                                    <span className="tf-badge tf-badge-warning">
                                        Pending
                                    </span>
                                </div>

                                <p className="text-muted small mt-4 mb-0">
                                    Preview only — these are sample tasks.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-5 bg-white">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Everything in one place</h2>

                        <p className="text-muted">
                            Keep your daily work organized and easy to manage.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="tf-card p-4 h-100">
                                <i className="bi bi-list-check fs-2 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Task Management
                                </h5>

                                <p className="text-muted mb-0">
                                    Create tasks, set priorities, and track
                                    your progress in one place.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="tf-card p-4 h-100">
                                <i className="bi bi-calendar-check fs-2 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Stay Organized
                                </h5>

                                <p className="text-muted mb-0">
                                    Keep due dates and upcoming work
                                    visible so important tasks stay on track.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="tf-card p-4 h-100">
                                <i className="bi bi-graph-up-arrow fs-2 text-primary"></i>

                                <h5 className="fw-bold mt-3">
                                    Track Progress
                                </h5>

                                <p className="text-muted mb-0">
                                    Get a clearer view of completed,
                                    pending, and in-progress work.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;