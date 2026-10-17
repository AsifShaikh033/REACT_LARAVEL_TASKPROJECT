import { Link } from 'react-router-dom';

function WebsiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-top mt-auto">
            <div className="container py-4">
                <div className="row align-items-center gy-3">
                    <div className="col-md-6">
                        <Link
                            to="/"
                            className="fw-bold fs-5 text-decoration-none"
                        >
                            <i className="bi bi-check2-square text-primary me-2"></i>
                            TaskFlow
                        </Link>

                        <p className="text-muted small mb-0 mt-2">
                            Organize your work. Achieve more.
                        </p>
                    </div>

                    <div className="col-md-6 text-md-end">
                        <Link to="/" className="text-muted me-3">
                            Home
                        </Link>

                        <Link to="/login" className="text-muted me-3">
                            Login
                        </Link>

                        <Link to="/register" className="text-muted">
                            Register
                        </Link>

                        <p className="text-muted small mt-3 mb-0">
                            © {currentYear} TaskFlow. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default WebsiteFooter;