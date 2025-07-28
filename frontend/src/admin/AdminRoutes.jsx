import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboard from "./pages/AdminDashboard";
import UsersPage from "./pages/UsersPage";
import SessionsPage from "./pages/SessionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import FeedbackPage from "./pages/FeedbackPage";
import NotificationsPage from "./pages/NotificationsPage";

function AdminLayout({ children, isLight, onToggleTheme, theme }) {
    return (
        <div className="fixed inset-0 flex min-h-screen w-screen bg-transparent">
            <AdminSidebar isLight={isLight} onToggleTheme={onToggleTheme} theme={theme} />
            <main className="flex-1 min-h-screen overflow-x-auto overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function AdminRoutes() {
    // Use localStorage for theme persistence
    const getInitialTheme = () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored === 'light' || stored === 'dark') return stored;
        }
        return 'dark';
    };
    const [theme, setTheme] = React.useState(getInitialTheme);
    const isLight = theme === 'light';
    const handleToggleTheme = () => {
        const next = isLight ? 'dark' : 'light';
        setTheme(next);
        if (typeof window !== 'undefined') localStorage.setItem('theme', next);
    };
    // Sync theme with localStorage changes (for cross-tab)
    React.useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
                setTheme(e.newValue);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);
    return (
        <Routes>
            <Route
                path=""
                element={
                    <AdminLayout isLight={isLight} onToggleTheme={handleToggleTheme} theme={theme}>
                        <AdminDashboard theme={theme} />
                    </AdminLayout>
                }
            />
            <Route
                path="notifications"
                element={
                    <AdminLayout isLight={isLight} onToggleTheme={handleToggleTheme} theme={theme}>
                        <NotificationsPage theme={theme} />
                    </AdminLayout>
                }
            />
            <Route
                path="users"
                element={
                    <AdminLayout isLight={isLight} onToggleTheme={handleToggleTheme} theme={theme}>
                        <UsersPage theme={theme} />
                    </AdminLayout>
                }
            />
            <Route
                path="sessions"
                element={
                    <AdminLayout isLight={isLight} onToggleTheme={handleToggleTheme} theme={theme}>
                        <SessionsPage theme={theme} />
                    </AdminLayout>
                }
            />
            <Route
                path="categories"
                element={
                    <AdminLayout isLight={isLight} onToggleTheme={handleToggleTheme} theme={theme}>
                        <CategoriesPage theme={theme} />
                    </AdminLayout>
                }
            />
            <Route
                path="registrations"
                element={
                    <AdminLayout isLight={isLight} onToggleTheme={handleToggleTheme} theme={theme}>
                        <RegistrationsPage theme={theme} />
                    </AdminLayout>
                }
            />
            <Route
                path="feedback"
                element={
                    <AdminLayout isLight={isLight} onToggleTheme={handleToggleTheme} theme={theme}>
                        <FeedbackPage theme={theme} />
                    </AdminLayout>
                }
            />

        </Routes>
    );
}

export default AdminRoutes;
