import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboard from "./pages/AdminDashboard";
import UsersPage from "./pages/UsersPage";
import CoursesPage from "./pages/CoursesPage";
import CategoriesPage from "./pages/CategoriesPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function AdminLayout({ children }) {
    return (
        <div className="fixed inset-0 flex min-h-screen w-screen bg-gradient-to-br from-[#181f2a] to-[#0d1117]">
            <AdminSidebar />
            <main className="flex-1 min-h-screen overflow-x-auto overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function AdminRoutes() {
    return (
        <Routes>
            <Route
                path=""
                element={
                    <AdminLayout>
                        <AdminDashboard />
                    </AdminLayout>
                }
            />
            <Route
                path="users"
                element={
                    <AdminLayout>
                        <UsersPage />
                    </AdminLayout>
                }
            />
            <Route
                path="courses"
                element={
                    <AdminLayout>
                        <CoursesPage />
                    </AdminLayout>
                }
            />
            <Route
                path="categories"
                element={
                    <AdminLayout>
                        <CategoriesPage />
                    </AdminLayout>
                }
            />
            <Route
                path="analytics"
                element={
                    <AdminLayout>
                        <AnalyticsPage />
                    </AdminLayout>
                }
            />
        </Routes>
    );
}

export default AdminRoutes;
