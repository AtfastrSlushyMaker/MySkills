import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { notificationApi } from '../services/api'
import {
    HomeOutlined,
    AppstoreOutlined,
    DashboardOutlined,
    ShopOutlined,
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    DownOutlined
} from '@ant-design/icons'
import { Badge, Avatar, Dropdown } from 'antd'

function Navigation() {
    const location = useLocation();
    const { user, logout, loading } = useAuth()

    // Theme state from localStorage
    const getInitialTheme = () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored === 'light' || stored === 'dark') return stored;
        }
        return 'dark';
    };

    const [theme, setTheme] = useState(getInitialTheme);
    const [unreadCount, setUnreadCount] = useState(0);
    const [avatarError, setAvatarError] = useState(false);
    const [dropdownAvatarError, setDropdownAvatarError] = useState(false);

    const isLight = theme === 'light';

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
                setTheme(e.newValue);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Reset avatar error states when user changes
    useEffect(() => {
        setAvatarError(false);
        setDropdownAvatarError(false);
    }, [user?.profile_picture]);

    // Hide navigation on admin routes
    if (location.pathname.startsWith('/admin')) return null;

    // Track unread notification count
    useEffect(() => {
        if (!user) return;
        notificationApi.getUserNotifications()
            .then(res => {
                const notifications = res.data.notifications || [];
                setUnreadCount(notifications.filter(n => !n.is_read).length);
            })
            .catch(() => setUnreadCount(0));
    }, [user]);

    // Helper functions - defined early
    const getUserDisplayName = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        return user?.first_name || user?.email || 'User';
    };

    const getUserInitials = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
        }
        if (user?.first_name) {
            return user.first_name.charAt(0).toUpperCase();
        }
        return 'U';
    };

    // Define navigation items based on authentication and role
    const getNavItems = () => {
        const publicItems = [
            { path: '/', label: 'Home', icon: <HomeOutlined /> },
            { path: '/categories', label: 'Categories', icon: <AppstoreOutlined /> },
        ];

        if (!user) {
            return [
                ...publicItems,
                { path: '/login', label: 'Login', icon: <UserOutlined /> },
            ];
        }

        // Authenticated user items
        const authenticatedItems = [
            ...publicItems,
            { path: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
        ];

        if (user.role === 'admin') {
            authenticatedItems.push({
                path: '/admin',
                label: 'Back Office',
                icon: <ShopOutlined />,
                onClick: () => {
                    localStorage.removeItem('adminFrontOffice');
                }
            });
        }

        return authenticatedItems;
    };

    const navItems = getNavItems();

    const handleLogout = () => {
        logout();
    };

    // Custom dropdown render function
    const renderDropdown = () => (
        <div className={`w-72 rounded-2xl shadow-2xl border backdrop-blur-2xl ${isLight
            ? 'bg-white/95 border-gray-200/80'
            : 'bg-gray-900/95 border-gray-700/50'
            }`}>
            {/* User Info Header */}
            <div className={`p-6 border-b ${isLight ? 'border-gray-100' : 'border-gray-700/50'
                }`}>
                <div className="flex items-center space-x-4">
                    <div className="relative">

                        <Avatar
                            size={50}
                            src={user?.profile_picture}
                            className={`shadow-lg ${isLight ? 'bg-gray-600' : 'bg-gray-400'
                                }`}
                            onError={() => {
                                console.log('Dropdown avatar image failed to load:', user?.profile_picture);
                                setDropdownAvatarError(true);
                                return false;
                            }}
                        >
                            {getUserInitials()}
                        </Avatar>
                        {unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg border-2 border-white">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className={`font-bold text-base ${isLight ? 'text-gray-900' : 'text-white'
                            }`}>
                            {getUserDisplayName()}
                        </h3>
                        <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                            {user?.email}
                        </p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 capitalize ${isLight
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-blue-900/30 text-blue-300'
                            }`}>
                            {user?.role}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
                <Link
                    to="/notifications"
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isLight
                        ? 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                        : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-900/30 text-blue-400'
                            }`}>
                            <BellOutlined className="text-sm" />
                        </div>
                        <span className="font-medium">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-2">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                    )}
                </Link>

                <Link
                    to="/profile"
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isLight
                        ? 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                        : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isLight ? 'bg-green-50 text-green-600' : 'bg-green-900/30 text-green-400'
                            }`}>
                            <UserOutlined className="text-sm" />
                        </div>
                        <span className="font-medium">My Profile</span>
                    </div>
                </Link>

                <div className={`mx-2 my-3 border-t ${isLight ? 'border-gray-100' : 'border-gray-700/50'
                    }`}></div>

                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isLight
                        ? 'hover:bg-red-50 text-gray-700 hover:text-red-600'
                        : 'hover:bg-red-900/20 text-gray-300 hover:text-red-400'
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isLight ? 'bg-red-50 text-red-600 group-hover:bg-red-100' : 'bg-red-900/30 text-red-400 group-hover:bg-red-900/40'
                            }`}>
                            <LogoutOutlined className="text-sm" />
                        </div>
                        <span className="font-medium">Sign Out</span>
                    </div>
                </button>
            </div>
        </div>
    );

    return (
        <nav className={
            isLight
                ? "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-gray-200/60 shadow-sm"
                : "fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-3xl border-b border-white/15 shadow-sm"
        }>
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Refined Logo Section */}
                    <Link
                        to="/"
                        className="flex items-center space-x-4 transition-all duration-300 hover:opacity-80 group"
                    >
                        <div className="relative">
                            <img
                                src="/logos/myskills-logo-icon.png"
                                alt="MySkills Logo"
                                className="h-11 w-auto transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div
                                className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg hidden ${isLight
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-900'
                                    }`}
                                style={{ display: 'none' }}
                            >
                                MS
                            </div>
                        </div>
                        <span className={`text-2xl font-bold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'
                            }`}>
                            MySkills
                        </span>
                    </Link>

                    {/* Enhanced Navigation Items */}
                    <div className="flex items-center space-x-1">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={item.onClick}
                                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2.5 hover:scale-[1.02] ${location.pathname === item.path
                                    ? isLight
                                        ? 'bg-black/8 text-gray-900 backdrop-blur-sm shadow-sm'
                                        : 'bg-white/12 text-white backdrop-blur-sm shadow-sm'
                                    : isLight
                                        ? 'text-gray-700 hover:bg-black/4 hover:text-gray-900'
                                        : 'text-gray-300 hover:bg-white/8 hover:text-white'
                                    }`}
                            >
                                <span className="text-base opacity-90">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}

                        {/* Enhanced User Section */}
                        {loading ? (
                            <div className="ml-8 flex items-center">
                                <div className={`animate-pulse flex items-center space-x-3 px-4 py-3 rounded-xl ${isLight ? 'bg-gray-100' : 'bg-white/10'
                                    }`}>
                                    <div className={`w-9 h-9 rounded-full ${isLight ? 'bg-gray-300' : 'bg-gray-600'
                                        }`}></div>
                                    <div className="space-y-1">
                                        <div className={`h-3 w-16 rounded ${isLight ? 'bg-gray-300' : 'bg-gray-600'
                                            }`}></div>
                                        <div className={`h-2 w-12 rounded ${isLight ? 'bg-gray-200' : 'bg-gray-700'
                                            }`}></div>
                                    </div>
                                </div>
                            </div>
                        ) : user ? (
                            <div className="ml-8">
                                {/* Enhanced User Profile Dropdown with Notification Indicator */}
                                <Dropdown
                                    popupRender={renderDropdown}
                                    trigger={['click']}
                                    placement="bottomRight"
                                >
                                    <div className="relative">
                                        <button
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${isLight
                                                ? 'hover:bg-black/6 hover:shadow-md'
                                                : 'hover:bg-white/8 hover:shadow-md'
                                                }`}
                                        >
                                            <div className="relative">
                                                <Avatar
                                                    size={40}
                                                    src={!avatarError && user.profile_picture ? user.profile_picture : null}
                                                    className={`shadow-lg ${isLight ? 'bg-gray-600' : 'bg-gray-400'
                                                        }`}
                                                    onError={() => {
                                                        console.log('Avatar image failed to load:', user.profile_picture);
                                                        setAvatarError(true);
                                                        return false;
                                                    }}
                                                >
                                                    {getUserInitials()}
                                                </Avatar>
                                                {/* Notification Indicator on Avatar */}
                                                {unreadCount > 0 && (
                                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg border-2 border-white">
                                                        {unreadCount > 99 ? '99+' : unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className={`text-sm font-semibold leading-tight ${isLight ? 'text-gray-900' : 'text-white'
                                                    }`}>
                                                    {user.first_name || 'User'}
                                                </span>
                                                <span className={`text-xs capitalize leading-tight font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <DownOutlined className={`text-xs transition-transform duration-300 ${isLight ? 'text-gray-500' : 'text-gray-400'
                                                }`} />
                                        </button>
                                    </div>
                                </Dropdown>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <style>{`
                .ant-dropdown {
                    padding: 0 !important;
                }
                
                .ant-dropdown .ant-dropdown-menu {
                    padding: 0 !important;
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                }
            `}</style>
        </nav>
    );
}

export default Navigation;