
import { Link } from 'react-router-dom';

function Home() {
    const features = [
        {
            icon: 'bi-list-check',
            title: 'Smart Task Management',
            description:
                'Create tasks, organize your workflow, and keep every important detail in one place.',
            color: 'blue',
            number: '01',
        },
        {
            icon: 'bi-calendar2-check',
            title: 'Plan Your Day',
            description:
                'Stay focused on deadlines and upcoming work with a clearer daily plan.',
            color: 'purple',
            number: '02',
        },
        {
            icon: 'bi-graph-up-arrow',
            title: 'Track Your Progress',
            description:
                'Understand what is completed, what is in progress, and what needs attention.',
            color: 'green',
            number: '03',
        },
    ];

    return (
        <main className="tf-home">
            {/* Hero */}
            <section className="tf-home-hero">
                <div className="tf-home-orb tf-home-orb-one" />
                <div className="tf-home-orb tf-home-orb-two" />

                <div className="container tf-home-hero-container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="tf-home-copy">
                                <div className="tf-home-eyebrow">
                                    <span className="tf-home-eyebrow-icon">
                                        <i className="bi bi-stars" />
                                    </span>
                                    A smarter way to work
                                    <span className="tf-home-eyebrow-dot" />
                                </div>

                                <h1 className="tf-home-title">
                                    Turn your
                                    <span className="tf-home-title-gradient">
                                        plans into
                                    </span>
                                    <span className="tf-home-title-last">
                                        progress.
                                    </span>
                                </h1>

                                <p className="tf-home-description">
                                    Bring your tasks, priorities, and daily plans
                                    together in one beautiful workspace.
                                    Less confusion, more focus, and a better
                                    way to get things done.
                                </p>

                                <div className="tf-home-actions">
                                    <Link
                                        to="/register"
                                        className="tf-home-primary-btn"
                                    >
                                        Get Started Free
                                        <i className="bi bi-arrow-up-right" />
                                    </Link>

                                    <Link
                                        to="/login"
                                        className="tf-home-secondary-btn"
                                    >
                                        <i className="bi bi-play-circle" />
                                        Sign In
                                    </Link>
                                </div>

                                <div className="tf-home-trust">
                                    <div className="tf-home-trust-icon">
                                        <i className="bi bi-check2-circle" />
                                    </div>

                                    <p>
                                        <strong>One workspace.</strong>
                                        <span> A clearer way to manage your day.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Animated dashboard preview */}
                        <div className="col-lg-6">
                            <div className="tf-home-visual">
                                <div className="tf-home-visual-glow" />
                                <div className="tf-home-visual-grid" />

                                <div className="tf-home-floating tf-home-floating-top">
                                    <span className="tf-home-floating-icon tf-home-floating-icon-green">
                                        <i className="bi bi-check2-all" />
                                    </span>
                                    <span>
                                        <strong>Stay on track</strong>
                                        <small>One task at a time</small>
                                    </span>
                                </div>

                                <div className="tf-home-dashboard">
                                    <div className="tf-home-dashboard-top">
                                        <div className="tf-home-dashboard-brand">
                                            <span className="tf-home-mini-logo">
                                                <i className="bi bi-check-lg" />
                                            </span>
                                            <span>My Workspace</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="tf-home-more"
                                            aria-label="Dashboard preview options"
                                            title="Dashboard preview"
                                        >
                                            <i className="bi bi-three-dots" />
                                        </button>
                                    </div>

                                    <div className="tf-home-dashboard-heading">
                                        <div>
                                            <span className="tf-home-dashboard-caption">
                                                YOUR OVERVIEW
                                            </span>
                                            <h3>Today's focus</h3>
                                        </div>

                                        <span className="tf-home-date">
                                            <i className="bi bi-calendar3 me-1" />
                                            Daily plan
                                        </span>
                                    </div>

                                    <div className="tf-home-stats">
                                        <div className="tf-home-stat">
                                            <span className="tf-home-stat-icon tf-home-stat-blue">
                                                <i className="bi bi-list-task" />
                                            </span>
                                            <span className="tf-home-stat-label">
                                                Total tasks
                                            </span>
                                            <strong>12</strong>
                                            <small>Sample data</small>
                                        </div>

                                        <div className="tf-home-stat">
                                            <span className="tf-home-stat-icon tf-home-stat-green">
                                                <i className="bi bi-check2-circle" />
                                            </span>
                                            <span className="tf-home-stat-label">
                                                Completed
                                            </span>
                                            <strong>8</strong>
                                            <small>Sample data</small>
                                        </div>
                                    </div>

                                    <div className="tf-home-task-heading">
                                        <strong>Task overview</strong>
                                        <span>Preview</span>
                                    </div>

                                    <div className="tf-home-preview-task">
                                        <span className="tf-home-preview-check tf-home-preview-done">
                                            <i className="bi bi-check-lg" />
                                        </span>
                                        <span className="tf-home-preview-task-text">
                                            <strong>Plan the week</strong>
                                            <small>Planning</small>
                                        </span>
                                        <span className="tf-home-status tf-home-status-done">
                                            Done
                                        </span>
                                    </div>

                                    <div className="tf-home-preview-task">
                                        <span className="tf-home-preview-check tf-home-preview-active">
                                            <i className="bi bi-arrow-repeat" />
                                        </span>
                                        <span className="tf-home-preview-task-text">
                                            <strong>Work on project</strong>
                                            <small>Development</small>
                                        </span>
                                        <span className="tf-home-status tf-home-status-active">
                                            Active
                                        </span>
                                    </div>

                                    <div className="tf-home-preview-task">
                                        <span className="tf-home-preview-check tf-home-preview-pending">
                                            <i className="bi bi-circle" />
                                        </span>
                                        <span className="tf-home-preview-task-text">
                                            <strong>Review progress</strong>
                                            <small>Review</small>
                                        </span>
                                        <span className="tf-home-status tf-home-status-pending">
                                            Next
                                        </span>
                                    </div>

                                    <div className="tf-home-dashboard-bottom">
                                        <i className="bi bi-info-circle" />
                                        Illustrative preview — not live account data
                                    </div>
                                </div>

                                <div className="tf-home-floating tf-home-floating-bottom">
                                    <span className="tf-home-progress-ring">
                                        <i className="bi bi-lightning-charge-fill" />
                                    </span>
                                    <span>
                                        <strong>Keep moving forward</strong>
                                        <small>Progress starts with a plan</small>
                                    </span>
                                </div>

                                <span className="tf-home-deco tf-home-deco-one" />
                                <span className="tf-home-deco tf-home-deco-two" />
                            </div>
                        </div>
                    </div>
                </div>

                <a href="#features" className="tf-home-scroll">
                    <span>Discover TaskFlow</span>
                    <i className="bi bi-arrow-down" />
                </a>
            </section>

            {/* Feature introduction */}
            <section id="features" className="tf-home-features">
                <div className="container">
                    <div className="tf-home-section-heading">
                        <span className="tf-home-section-eyebrow">
                            <i className="bi bi-grid me-2" />
                            BUILT FOR YOUR EVERYDAY
                        </span>

                        <h2>
                            Everything you need.
                            <span> Nothing to distract you.</span>
                        </h2>

                        <p>
                            Simple tools to help you organize work,
                            prioritize what matters, and move forward.
                        </p>
                    </div>

                    <div className="row g-4">
                        {features.map((feature) => (
                            <div className="col-md-6 col-lg-4" key={feature.number}>
                                <article className="tf-home-feature-card">
                                    <div className="tf-home-feature-top">
                                        <span
                                            className={`tf-home-feature-icon tf-home-feature-${feature.color}`}
                                        >
                                            <i className={`bi ${feature.icon}`} />
                                        </span>

                                        <span className="tf-home-feature-number">
                                            {feature.number}
                                        </span>
                                    </div>

                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>

                                    <div className="tf-home-feature-line">
                                        <span />
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to action */}
            <section className="tf-home-cta-section">
                <div className="container">
                    <div className="tf-home-cta">
                        <div className="tf-home-cta-orb" />

                        <div className="tf-home-cta-content">
                            <span className="tf-home-cta-eyebrow">
                                <i className="bi bi-stars me-2" />
                                YOUR NEXT CHAPTER STARTS HERE
                            </span>

                            <h2>
                                Ready to make your
                                <span> day count?</span>
                            </h2>

                            <p>
                                Start organizing your work with TaskFlow
                                and take the next step toward your goals.
                            </p>

                            <Link
                                to="/register"
                                className="tf-home-cta-button"
                            >
                                Create Your Account
                                <i className="bi bi-arrow-right" />
                            </Link>
                        </div>

                        <div className="tf-home-cta-decoration" aria-hidden="true">
                            <div className="tf-home-cta-check">
                                <i className="bi bi-check-lg" />
                            </div>
                            <span className="tf-home-cta-spark tf-home-cta-spark-one">
                                ✦
                            </span>
                            <span className="tf-home-cta-spark tf-home-cta-spark-two">
                                ✧
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;
