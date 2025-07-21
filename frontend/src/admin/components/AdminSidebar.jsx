import React from 'react';
import mySkillsLogo from '../../../public/logos/myskills-logo-icon.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    AppstoreOutlined,
    SolutionOutlined, // Registrations
    CheckCircleOutlined, // Attendance
    MessageOutlined, // Feedback
    GlobalOutlined,
    LogoutOutlined,
    SettingOutlined,
    BellOutlined
} from '@ant-design/icons';
import { Avatar, Badge } from 'antd';

function AdminSidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const currentPath = window.location.pathname;

    const navLinks = [
        { to: '/admin', label: 'Dashboard', icon: DashboardOutlined },
        { to: '/admin/users', label: 'Users', icon: UserOutlined },
        { to: '/admin/sessions', label: 'Sessions', icon: BookOutlined },
        { to: '/admin/categories', label: 'Categories', icon: AppstoreOutlined },
        { to: '/admin/registrations', label: 'Registrations', icon: SolutionOutlined },
        { to: '/admin/attendance', label: 'Attendance', icon: CheckCircleOutlined },
        { to: '/admin/feedback', label: 'Feedback', icon: MessageOutlined },
        { to: '/admin/notifications', label: 'Notifications', icon: BellOutlined },
    ];

    // Import BellOutlined icon
    // (add to import list at the top if not already present)

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleFrontOffice = () => {
        localStorage.setItem('adminFrontOffice', 'true');
        navigate('/');
    };

    const handleNavClick = (path) => {
        navigate(path);
    };

    return (
        <aside className="w-72 min-h-screen h-full flex flex-col z-30 relative overflow-hidden rounded-tr-3xl rounded-br-3xl bg-gradient-to-b from-slate-900 to-indigo-900">
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/5"
                        style={{
                            width: `${Math.random() * 8 + 2}px`,
                            height: `${Math.random() * 8 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `pulse ${Math.random() * 6 + 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full py-6">
                {/* Logo Section - Removed background and border */}
                <div className="flex items-center gap-4 px-6 mb-8">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                        <img
                            src={mySkillsLogo}
                            alt="MySkills Logo"
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl text-white tracking-tight">
                            MySkills
                        </h1>
                        <span className="text-blue-400 font-medium text-xs tracking-wider uppercase">
                            ADMIN PANEL
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 px-3 py-2 mb-4">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = currentPath === link.to;

                        return (
                            <button
                                key={link.to}
                                onClick={() => handleNavClick(link.to)}
                                className={`group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap relative overflow-hidden w-full text-left ${isActive
                                    ? "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 text-white shadow-inner"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-md"></div>
                                )}

                                {/* Icon */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive
                                    ? "bg-white/20"
                                    : "bg-white/5 group-hover:bg-white/10"
                                    }`}>
                                    <Icon className="text-lg" />
                                </div>

                                <span className="flex-1 text-base">{link.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Settings Link */}
                <div className="mb-2 px-3">
                    <button
                        onClick={() => handleNavClick('/admin/settings')}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-white/10 hover:text-white w-full text-left transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                            <SettingOutlined className="text-lg" />
                        </div>
                        <span className="flex-1 text-base">Settings</span>
                    </button>
                </div>

                {/* Spacer to push content down */}
                <div className="flex-grow"></div>

                {/* Action Buttons */}
                <div className="px-4 py-4">
                    <button
                        onClick={handleFrontOffice}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors mb-3"
                    >
                        <GlobalOutlined />
                        View Front Office
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500/10 text-red-100 font-medium hover:bg-red-500/20 transition-colors"
                    >
                        <LogoutOutlined />
                        Logout
                    </button>
                </div>

                {/* User Profile at the bottom */}
                <div className="px-6 pt-4 pb-6">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-lg border border-white/10">
                        <Badge dot color="green" className="flex-shrink-0">
                            <Avatar
                                size={42}
                                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow"
                            >
                                {user?.first_name?.charAt(0).toUpperCase() || 'A'}
                            </Avatar>
                        </Badge>
                        <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold truncate">
                                {user?.first_name || 'Admin'} {user?.last_name}
                            </div>
                            <div className="text-xs text-blue-300 truncate">
                                {user?.email || 'admin@myskills.com'}
                            </div>
                            <div className="text-xs text-blue-400 uppercase tracking-wider mt-1">
                                {user?.role || 'Administrator'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Version */}
                <div className="px-4 py-2 text-center text-xs text-white/50">
                    MySkills Admin v2.4.1
                </div>
            </div>

            <style >{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.1; transform: scale(0.95); }
                    50% { opacity: 0.4; transform: scale(1.05); }
                }
            `}</style>
        </aside>
    );
}

export default AdminSidebar;