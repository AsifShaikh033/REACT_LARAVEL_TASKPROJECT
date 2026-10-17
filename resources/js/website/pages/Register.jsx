import { Link } from 'react-router-dom';

function Register() {
    function handleSubmit(event) {
        event.preventDefault();

        // Laravel registration API will be connected in the authentication step.
    }

    return (
        <section className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">
                    <div className="tf-card p-4 p-md-5">
                        <div className="text-center mb-4">
                            <i className="bi bi-person-plus text-primary fs-1"></i>

                            <h2 className="fw-bold mt-3">Create Account</h2>

                            <p className="text-muted">
                                Get started with TaskFlow today.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                />
                            </div>

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
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="password_confirmation"
                                    className="form-label"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className="text-center text-muted mt-4 mb-0">
                            Already registered?{' '}
                            <Link to="/login" className="fw-semibold">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;