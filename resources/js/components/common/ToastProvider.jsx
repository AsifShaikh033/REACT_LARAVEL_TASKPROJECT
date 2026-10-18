import {
    createContext,
    useCallback,
    useContext,
    useState,
} from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [nextId, setNextId] = useState(1);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();

        setToasts((current) => [
            ...current,
            {
                id,
                message,
                type,
            },
        ]);

        // Automatically remove the notification after 4 seconds.
        window.setTimeout(() => {
            setToasts((current) =>
                current.filter((toast) => toast.id !== id)
            );
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((current) =>
            current.filter((toast) => toast.id !== id)
        );
    }, []);

    const success = useCallback(
        (message) => showToast(message, 'success'),
        [showToast]
    );

    const error = useCallback(
        (message) => showToast(message, 'error'),
        [showToast]
    );

    const warning = useCallback(
        (message) => showToast(message, 'warning'),
        [showToast]
    );

    const info = useCallback(
        (message) => showToast(message, 'info'),
        [showToast]
    );

    return (
        <ToastContext.Provider
            value={{ success, error, warning, info }}
        >
            {children}

            <div
                className="toast-container position-fixed top-0 end-0 p-3"
                style={{ zIndex: 1090 }}
                aria-live="polite"
                aria-atomic="false"
            >
                {toasts.map((toast) => {
                    const styles = {
                        success: {
                            className: 'text-bg-success',
                            icon: 'bi-check-circle-fill',
                        },
                        error: {
                            className: 'text-bg-danger',
                            icon: 'bi-x-circle-fill',
                        },
                        warning: {
                            className: 'text-bg-warning',
                            icon: 'bi-exclamation-triangle-fill',
                        },
                        info: {
                            className: 'text-bg-info',
                            icon: 'bi-info-circle-fill',
                        },
                    };

                    const style = styles[toast.type] || styles.info;

                    return (
                        <div
                            key={toast.id}
                            className={`toast show mb-2 ${style.className}`}
                            role="status"
                        >
                            <div className="d-flex align-items-center p-3 gap-2">
                                <i
                                    className={`bi ${style.icon} fs-5`}
                                    aria-hidden="true"
                                />

                                <div className="flex-grow-1">
                                    {toast.message}
                                </div>

                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    aria-label="Close notification"
                                    onClick={() => removeToast(toast.id)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            'useToast must be used inside ToastProvider.'
        );
    }

    return context;
}