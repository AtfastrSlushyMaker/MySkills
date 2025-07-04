import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

function ProfessionalNavigation() {
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [hoveredItem, setHoveredItem] = useState(null)
    const navRef = useRef(null)
    const { isAuthenticated, user, logout } = useAuth()

    const navItems = isAuthenticated ? [
        // What should LOGGED-IN users see?
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/courses', label: 'Courses', icon: '📚' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ] : [
        // What should VISITORS see?
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/courses', label: 'Courses', icon: '📚' },
        { path: '/login', label: 'Login', icon: '🔐' },
        { path: '/signup', label: 'Sign Up', icon: '📝' },
    ]

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (navRef.current) {
                const rect = navRef.current.getBoundingClientRect()
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                })
            }
        }
        const nav = navRef.current
        if (nav) {
            nav.addEventListener('mousemove', handleMouseMove)
            return () => nav.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <nav
            ref={navRef}
            className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-500
                ${isScrolled
                    ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10'
                    : 'bg-slate-900/90 backdrop-blur-lg'
                }
            `}
            style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
        >
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-slate-800/30 to-slate-900/50"></div>

            {/* Moving highlight that follows mouse */}
            <div
                className="absolute h-full w-32 opacity-10 pointer-events-none transition-all duration-700 ease-out"
                style={{
                    left: `${mousePosition.x - 64}px`,
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                    filter: 'blur(20px)'
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Section - Clean and Professional */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                                <img
                                    src="/logos/myskills-logo-icon.png"
                                    alt="MySkills"
                                    className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                                MySkills
                            </h1>
                            <p className="text-xs text-gray-400 -mt-1 font-medium">
                                Training Platform
                            </p>
                        </div>
                    </Link>

                    {/* Main Navigation - Clean Horizontal Layout */}
                    <div className="flex items-center space-x-1">
                        {navItems.map((item, index) => {
                            const isActive = location.pathname === item.path

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredItem(index)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className={`
                                        relative px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer
                                        ${isActive
                                            ? 'text-white bg-blue-600/20 shadow-lg'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }
                                    `}>
                                        {/* Active background */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-blue-500/20 rounded-lg"></div>
                                        )}

                                        {/* Hover background */}
                                        <div className={`
                                            absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                            ${isActive ? 'hidden' : ''}
                                        `}></div>

                                        {/* Content */}
                                        <div className="relative flex items-center space-x-2">
                                            <span className={`text-sm transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                                                }`}>
                                                {item.icon}
                                            </span>
                                            <span className="font-medium text-sm tracking-wide">
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Side Actions - Integrated Design */}
                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 group">
                            <span className="text-lg group-hover:scale-110 transition-transform duration-300">🔍</span>
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 group">
                            <span className="text-lg group-hover:scale-110 transition-transform duration-300">🔔</span>
                            {/* Notification badge */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                        </button>

                        {/* User Menu / Profile */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-300 hidden sm:block">
                                    Hi, {user?.first_name}!
                                </span>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 group"
                                    title="Logout"
                                >
                                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">🚪</span>
                                </button>
                            </div>
                        ) : (
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 group">
                                <span className="text-lg group-hover:scale-110 transition-transform duration-300">👤</span>
                            </button>
                        )}

                        {/* Mobile menu (hidden on desktop) */}
                        <button className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom border - Subtle and Professional */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        </nav>
    )
}

export default ProfessionalNavigation
