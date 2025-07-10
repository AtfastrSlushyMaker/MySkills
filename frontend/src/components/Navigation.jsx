import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

function Navigation() {
    const location = useLocation()
    const { user, logout, loading } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Define navigation items based on authentication and role
    const getNavItems = () => {
        const publicItems = [
            { path: '/', label: 'Home', icon: 'fas fa-home' },

        ]

        if (!user) {
            return [
                ...publicItems,
                { path: '/categories', label: 'Categories', icon: 'fas fa-th-list' },
                { path: '/login', label: 'Login', icon: 'fas fa-sign-in-alt' },

            ]
        }

        // Authenticated user items
        const authenticatedItems = [
            ...publicItems,
            { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-chart-pie' },
            { path: '/sessions', label: 'Sessions', icon: 'fas fa-graduation-cap' },
        ]

        // Add role-specific items
        if (user.role === 'admin' || user.role === 'super_admin') {
            authenticatedItems.push(
                { path: '/admin', label: 'Admin Panel', icon: 'fas fa-cogs' },
                { path: '/users', label: 'Users', icon: 'fas fa-users' }
            )
        }

        if (user.role === 'instructor' || user.role === 'admin' || user.role === 'super_admin') {
            authenticatedItems.push(
                { path: '/instructor', label: 'Instructor', icon: 'fas fa-chalkboard-teacher' }
            )
        }

        return authenticatedItems
    }

    const navItems = getNavItems()

    const handleLogout = () => {
        logout()
        setIsProfileDropdownOpen(false)
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-2xl"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 py-2">
                    {/* Logo Section - Enhanced Glassmorphism */}
                    <Link
                        to="/"
                        className="flex items-center space-x-3 text-white hover:text-blue-100 transition-all duration-500 group relative"
                    >
                        {/* Glass background for logo */}
                        <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100"></div>

                        <div className="relative flex items-center space-x-3 px-4 py-2">
                            <div className="relative">
                                <img
                                    src="/logos/myskills-logo-icon.png"
                                    alt="MySkills Logo"
                                    className="h-12 w-auto transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-2xl"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                    }}
                                />
                                <div
                                    className="h-12 w-12 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm border border-white/20 shadow-xl hidden"
                                    style={{ display: 'none' }}
                                >
                                    MS
                                </div>
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                            </div>
                            <div className="relative">
                                <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-lg">
                                    MySkills
                                </span>
                                {/* Text glow */}
                                <div className="absolute inset-0 text-2xl font-bold text-white/20 blur-sm">
                                    MySkills
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Glassmorphism Style */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-500 flex items-center space-x-2 group overflow-hidden ${location.pathname === item.path
                                    ? 'bg-white/20 text-white shadow-2xl backdrop-blur-md border border-white/30'
                                    : 'text-white/90 hover:bg-white/10 hover:text-white hover:backdrop-blur-md hover:border-white/20 border border-transparent'
                                    }`}
                            >
                                {/* Glass background effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-xl"></div>

                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                <span className="relative group-hover:scale-110 transition-all duration-300 drop-shadow-lg">
                                    <i className={`${item.icon} text-lg`}></i>
                                </span>
                                <span className="relative font-semibold tracking-wide drop-shadow-sm">{item.label}</span>

                                {/* Active indicator */}
                                {location.pathname === item.path && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full shadow-lg"></div>
                                )}
                            </Link>
                        ))}

                        {/* User Profile Section - Enhanced Glassmorphism */}
                        {loading ? (
                            <div className="ml-6 flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                <LoadingSpinner size="sm" />
                                <span className="text-white/80 text-sm">Loading...</span>
                            </div>
                        ) : user && (
                            <div className="relative ml-6" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-5 py-3 rounded-2xl transition-all duration-500 border border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl group"
                                >
                                    {/* User avatar with glassmorphism */}
                                    <div className="relative">
                                        <div className="h-10 w-10 bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-2xl border border-white/30 backdrop-blur-sm">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        {/* Avatar glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 to-blue-400/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                                    </div>

                                    <div className="hidden lg:block">
                                        <span className="text-white font-semibold text-sm drop-shadow-sm">
                                            {user?.first_name || 'User'}
                                        </span>
                                        <div className="text-xs text-white/70 font-medium uppercase tracking-widest">
                                            {user.role}
                                        </div>
                                    </div>

                                    <svg
                                        className={`h-4 w-4 text-white/80 transition-all duration-500 ${isProfileDropdownOpen ? 'rotate-180' : ''} group-hover:text-white`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Enhanced Dropdown Menu with Glassmorphism */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-4 w-96 bg-white/8 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 z-dropdown overflow-hidden transform transition-all duration-300 scale-100 opacity-100 animate-in slide-in-from-top-2">
                                        {/* Enhanced glass overlay with gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5"></div>

                                        {/* Animated shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 animate-pulse"></div>

                                        {/* Enhanced Header section */}
                                        <div className="relative p-8 bg-gradient-to-br from-purple-500/25 via-blue-500/20 to-indigo-500/25 border-b border-white/25">
                                            <div className="flex items-center space-x-5">
                                                <div className="relative">
                                                    <div className="h-20 w-20 bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl border-2 border-white/40 backdrop-blur-sm">
                                                        {user?.first_name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    {/* Enhanced avatar glow with animation */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-400/50 rounded-3xl blur-xl animate-pulse"></div>
                                                    {/* Status indicator with enhanced animation */}
                                                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-400 rounded-full border-2 border-white/60 shadow-lg">
                                                        <div className="h-full w-full bg-green-400 rounded-full animate-ping opacity-75"></div>
                                                        <div className="absolute inset-0 h-full w-full bg-green-300 rounded-full animate-pulse"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <p className="font-bold text-xl text-white drop-shadow-lg">
                                                            {user?.first_name || 'User'} {user?.last_name || ''}
                                                        </p>
                                                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse shadow-sm"></div>
                                                    </div>
                                                    <p className="text-sm text-white/90 drop-shadow-sm mb-3 font-medium">{user?.email}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
                                                            <div className="h-2 w-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                                                            <p className="text-xs text-white font-bold uppercase tracking-widest">
                                                                {user?.role}
                                                            </p>
                                                        </div>
                                                        <div className="px-3 py-1 bg-green-400/20 backdrop-blur-sm rounded-xl border border-green-400/30">
                                                            <p className="text-xs text-green-300 font-semibold">Active</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Menu items */}
                                        <div className="relative p-3">

                                            <Link
                                                to="/profile"
                                                className="flex items-center space-x-4 px-5 py-4 text-white/90 hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10 rounded-2xl transition-all duration-300 group backdrop-blur-sm hover:backdrop-blur-md border border-transparent hover:border-white/30 hover:shadow-lg mb-2"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30 group-hover:scale-110 transition-transform duration-300">
                                                    <i className="fas fa-user text-blue-400"></i>
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-semibold text-white">My Profile</span>
                                                    <div className="text-xs text-white/60">View and edit your profile</div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                                                    <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </Link>

                                            <Link
                                                to="/settings"
                                                className="flex items-center space-x-4 px-5 py-4 text-white/90 hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10 rounded-2xl transition-all duration-300 group backdrop-blur-sm hover:backdrop-blur-md border border-transparent hover:border-white/30 hover:shadow-lg mb-2"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30 group-hover:scale-110 transition-transform duration-300">
                                                    <i className="fas fa-cog text-purple-400"></i>
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-semibold text-white">Settings</span>
                                                    <div className="text-xs text-white/60">Preferences and configuration</div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                                                    <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </Link>

                                            {/* Notifications with enhanced badge */}
                                            <Link
                                                to="/notifications"
                                                className="flex items-center space-x-4 px-5 py-4 text-white/90 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 rounded-2xl transition-all duration-300 group backdrop-blur-sm hover:backdrop-blur-md border border-transparent hover:border-yellow-400/20 hover:shadow-lg mb-2"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30 group-hover:scale-110 transition-transform duration-300 relative">
                                                    <i className="fas fa-bell text-yellow-400 group-hover:text-yellow-300"></i>
                                                    {/* Notification badge - removed fake data */}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-semibold text-white group-hover:text-yellow-100">Notifications</span>
                                                    <div className="text-xs text-white/60 group-hover:text-yellow-200/80">View your notifications</div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                                                    <svg className="h-5 w-5 text-white/70 group-hover:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </Link>

                                            <hr className="my-4 border-white/25" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-4 px-5 py-4 text-red-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm hover:backdrop-blur-md border border-transparent hover:border-red-300/40 hover:shadow-lg"
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl border border-red-400/30 group-hover:scale-110 transition-transform duration-300">
                                                    <i className="fas fa-sign-out-alt text-red-400"></i>
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <span className="font-semibold text-red-300">Sign Out</span>
                                                    <div className="text-xs text-red-300/70">End your session securely</div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                                                    <svg className="h-5 w-5 text-red-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button - Glassmorphism Style */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-3 rounded-2xl text-white hover:bg-white/20 transition-all duration-500 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-xl"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Menu - Enhanced Glassmorphism with Fixed Z-Index */}
                {isMobileMenuOpen && (
                    <>
                        {/* Mobile menu backdrop overlay - FIXED: Higher z-index and better coverage */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        ></div>

                        <div className="fixed top-[72px] left-0 right-0 bg-white/10 backdrop-blur-3xl border-t border-white/30 shadow-2xl z-[70] md:hidden min-h-screen">
                            {/* Glass overlay for enhanced effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-blue-500/15 to-indigo-500/20"></div>
                            <div className="relative px-4 pt-4 pb-6 space-y-2">
                                {navItems.map(item => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-4 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-500 backdrop-blur-sm border ${location.pathname === item.path
                                            ? 'bg-white/20 text-white border-white/30 shadow-xl'
                                            : 'text-white/90 hover:bg-white/10 hover:text-white border-transparent hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-lg">
                                            <i className={item.icon}></i>
                                        </span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}

                                {loading ? (
                                    <div className="px-4 py-3 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                        <LoadingSpinner size="sm" />
                                        <span className="ml-3 text-white/70">Loading...</span>
                                    </div>
                                ) : user && (
                                    <>
                                        <hr className="my-4 border-white/20" />

                                        {/* Mobile user profile section */}
                                        <div className="px-4 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="relative">
                                                    <div className="h-12 w-12 bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-2xl border border-white/30">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl blur-lg"></div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white drop-shadow-lg">{user.name || 'User'}</p>
                                                    <p className="text-sm text-white/80 drop-shadow-sm">{user.email}</p>
                                                    <div className="inline-block mt-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                                        <p className="text-xs text-white font-bold uppercase tracking-wider">
                                                            {user.role}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center space-x-4 px-4 py-3 text-white/90 hover:bg-white/10 hover:text-white rounded-2xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20"
                                        >
                                            <span className="text-lg">
                                                <i className="fas fa-user"></i>
                                            </span>
                                            <span className="font-medium">My Profile</span>
                                        </Link>

                                        <Link
                                            to="/settings"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center space-x-4 px-4 py-3 text-white/90 hover:bg-white/10 hover:text-white rounded-2xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20"
                                        >
                                            <span className="text-lg">
                                                <i className="fas fa-cog"></i>
                                            </span>
                                            <span className="font-medium">Settings</span>
                                        </Link>

                                        <button
                                            onClick={() => {
                                                handleLogout()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full flex items-center space-x-4 px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-red-300/30"
                                        >
                                            <span className="text-lg">
                                                <i className="fas fa-sign-out-alt"></i>
                                            </span>
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navigation
