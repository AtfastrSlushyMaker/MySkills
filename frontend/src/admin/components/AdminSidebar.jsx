import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
    { to: "/admin", label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { to: "/admin/users", label: "Users", icon: "fas fa-users" },
    { to: "/admin/courses", label: "Courses", icon: "fas fa-graduation-cap" },
    { to: "/admin/categories", label: "Categories", icon: "fas fa-th-list" },
    { to: "/admin/analytics", label: "Analytics", icon: "fas fa-chart-bar" },
];

function AdminSidebar() {
    const location = useLocation();
    return (
        <aside className="w-64 min-h-screen h-full flex flex-col bg-gradient-to-b from-[#181f2a] to-[#0d1117] shadow-2xl border-4 border-red-500 z-20 backdrop-blur-xl bg-opacity-80">
            <div className="flex items-center gap-3 px-6 py-8 mb-2">
                <img
                    src="/logos/myskills-logo-icon.png"
                    alt="MySkills"
                    className="w-10 h-10 rounded-xl shadow-lg ring-2 ring-cyan-400/40"
                />
                <span className="font-bold text-xl text-cyan-300 tracking-tight drop-shadow-lg">
                    MySkills Admin
                </span>
            </div>
            <div className="text-red-500 font-bold text-center mb-2">DEBUG: Sidebar is rendering</div>
            <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
                {navLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap backdrop-blur-md
              ${location.pathname === link.to
                                ? "bg-cyan-900/80 text-white shadow-md ring-1 ring-cyan-400/30"
                                : "text-gray-300 hover:bg-cyan-800/30 hover:text-cyan-200 hover:shadow-lg hover:ring-1 hover:ring-cyan-400/20"
                            }`}
                    >
                        <i className={`${link.icon} text-base`}></i>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

export default AdminSidebar;
