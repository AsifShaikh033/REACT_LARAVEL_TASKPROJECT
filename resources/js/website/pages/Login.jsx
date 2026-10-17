import { Link } from 'react-router-dom';

function Login() {
    function handleSubmit(event) {
        event.preventDefault();

        // Laravel login API will be connected in the authentication step.
    }

    return (
        <section className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">
                    <div className="tf-card p-4 p-md-5">
                        <div className="text-center mb-4">
                            <i className="bi bi-check2-square text-primary fs-1"></i>

                            <h2 className="fw-bold mt-3">Welcome Back</h2>

                            <p className="text-muted">
                                Sign in to continue to TaskFlow.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2"
                            >
                                Login
                            </button>
                        </form>

                        <p className="text-center text-muted mt-4 mb-0">
                            Don't have an account?{' '}
                            <Link to="/register" className="fw-semibold">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;