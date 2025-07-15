import React from "react";

function StatCard({ title, value, icon }) {
    return (
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-cyan-900/60 to-cyan-700/40 shadow-xl backdrop-blur-lg border border-cyan-400/20">
            <div className="text-3xl text-cyan-300">
                <i className={icon}></i>
            </div>
            <div>
                <div className="text-lg font-semibold text-cyan-100">{title}</div>
                <div className="text-2xl font-bold text-white drop-shadow-lg">{value}</div>
            </div>
        </div>
    );
}

function AdminDashboard() {
    return (
        <div className="flex flex-col gap-8 p-8 min-h-screen bg-gradient-to-br from-[#181f2a] to-[#0d1117] backdrop-blur-xl">
            <h1 className="text-3xl font-bold text-cyan-200 mb-4 drop-shadow-lg">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Users" value={"1,234"} icon="fas fa-users" />
                <StatCard title="Courses" value={"56"} icon="fas fa-graduation-cap" />
                <StatCard title="Categories" value={"12"} icon="fas fa-th-list" />
                <StatCard title="Analytics" value={"99%"} icon="fas fa-chart-bar" />
            </div>
            <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-cyan-900/40 to-cyan-700/20 shadow-lg backdrop-blur-lg border border-cyan-400/10">
                <h2 className="text-xl font-semibold text-cyan-100 mb-2">Welcome to the Admin Panel</h2>
                <p className="text-gray-300">Manage users, courses, categories, and view analytics with a modern, glassy interface. All admin features are robust and visually impressive.</p>
            </div>
        </div>
    );
}

export default AdminDashboard;
