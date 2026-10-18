import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/common/ToastProvider.jsx';

import WebsiteLayout from './website/layouts/WebsiteLayout.jsx';

import Home from './website/pages/Home.jsx';
import Login from './website/pages/Login.jsx';
import Register from './website/pages/Register.jsx';
import Tasks from './website/pages/Tasks.jsx';
import UserDashboard from './website/pages/UserDashboard';

function Apps() {
    return (
        <ToastProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<WebsiteLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/tasks" element={<Tasks />} />
                            <Route path="/user/dashboard" element={<UserDashboard />} />
                        </Route>

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
            </AuthProvider>
        </ToastProvider>
    );
}

export default Apps;