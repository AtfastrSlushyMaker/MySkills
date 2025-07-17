import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    GlobalOutlined,
    LogoutOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Avatar, Typography, Divider, Badge } from 'antd';

const { Text } = Typography;


function AdminSidebar({ isLight, onToggleTheme, theme }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const currentPath = window.location.pathname;

    const navLinks = [
        { to: '/admin', label: 'Dashboard', icon: DashboardOutlined },
        { to: '/admin/users', label: 'Users', icon: UserOutlined },
        { to: '/admin/courses', label: 'Courses', icon: BookOutlined },
        { to: '/admin/categories', label: 'Categories', icon: AppstoreOutlined },
        { to: '/admin/analytics', label: 'Analytics', icon: BarChartOutlined },
    ];

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
        <aside className="w-64 min-h-screen h-full flex flex-col z-20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-xl border-r border-white/10"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Logo Section */}
                <div className="flex items-center gap-3 px-6 py-8 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-blue-400/30">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight drop-shadow-lg">
                        MySkills Admin
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = currentPath === link.to;

                        return (
                            <button
                                key={link.to}
                                onClick={() => handleNavClick(link.to)}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap relative overflow-hidden w-full text-left ${isActive
                                    ? "bg-white/20 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-md"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-md hover:ring-1 hover:ring-white/10 hover:backdrop-blur-md"
                                    }`}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-full"></div>
                                )}

                                {/* Icon with background */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive
                                    ? "bg-white/20 backdrop-blur-sm"
                                    : "bg-white/10 backdrop-blur-sm group-hover:bg-white/15"
                                    }`}>
                                    <Icon className="text-base" />
                                </div>

                                <span className="flex-1">{link.label}</span>

                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            </button>
                        );
                    })}
                </nav>

                {/* Settings Link */}
                <div className="px-3 pb-4">
                    <button
                        onClick={() => handleNavClick('/admin/settings')}
                        className="group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-md hover:ring-1 hover:ring-white/10 hover:backdrop-blur-md w-full text-left"
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 bg-white/10 backdrop-blur-sm group-hover:bg-white/15">
                            <SettingOutlined className="text-base" />
                        </div>
                        <span className="flex-1">Settings</span>
                    </button>
                </div>

                <Divider className="border-white/10 mx-4" />

                {/* Action Buttons */}
                <div className="px-4 py-4 flex flex-col gap-3">
                    <button
                        onClick={handleFrontOffice}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white font-semibold hover:from-blue-500/80 hover:to-indigo-500/80 transition-all duration-300 shadow-lg backdrop-blur-md border border-white/10"
                    >
                        <GlobalOutlined className="text-base" />
                        Front Office
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/10 text-gray-300 font-semibold hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 backdrop-blur-md border border-white/10"
                    >
                        <LogoutOutlined className="text-base" />
                        Logout
                    </button>
                </div>

                {/* User Profile */}
                <div className="px-4 py-6 border-t border-white/10">
                    <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all duration-300">
                        <Badge
                            dot
                            status="success"
                            className="flex-shrink-0"
                        >
                            <Avatar
                                size={40}
                                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold"
                            >
                                {user?.first_name?.charAt(0).toUpperCase() || 'A'}
                            </Avatar>
                        </Badge>
                        <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold truncate">
                                {user?.first_name || 'Admin'}
                            </div>
                            <div className="text-xs text-blue-300 uppercase tracking-widest">
                                {user?.role || 'Administrator'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-indigo-400/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400/25 rounded-full animate-pulse delay-2000"></div>
            </div>

            <style> {`
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse {
                    animation: pulse 3s ease-in-out infinite;
                }
                .delay-1000 {
                    animation-delay: 1s;
                }
                .delay-2000 {
                    animation-delay: 2s;
                }
                
                /* Scrollbar styling */
                aside::-webkit-scrollbar {
                    width: 4px;
                }
                aside::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }
                aside::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                }
                aside::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </aside >
    );
}

export default AdminSidebar;