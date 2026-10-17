
import { NavLink, Link } from 'react-router-dom';

function WebsiteNavbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4" to="/">
                    <i className="bi bi-check2-square text-primary me-2"></i>
                    TaskFlow
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#websiteNavbar"
                    aria-controls="websiteNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="websiteNavbar"
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active fw-semibold' : ''}`
                                }
                            >
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="#features">
                                Features
                            </a>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active fw-semibold' : ''}`
                                }
                            >
                                Login
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/register"
                                className="btn btn-primary ms-lg-2"
                            >
                                Get Started
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default WebsiteNavbar;
