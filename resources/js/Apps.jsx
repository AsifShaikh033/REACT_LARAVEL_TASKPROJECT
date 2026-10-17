import { BrowserRouter, Routes, Route } from 'react-router-dom';

import WebsiteLayout from './website/layouts/WebsiteLayout.jsx';

import Home from './website/pages/Home.jsx';
import Login from './website/pages/Login.jsx';
import Register from './website/pages/Register.jsx';

function Apps() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Website Routes */}
                <Route element={<WebsiteLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* 404 Page */}
                <Route
                    path="*"
                    element={
                        <div className="container py-5 text-center">
                            <h1 className="display-4 fw-bold">404</h1>
                            <p className="text-muted">
                                Sorry, this page could not be found.
                            </p>
                            <a href="/" className="btn btn-primary">
                                Back to Home
                            </a>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default Apps;