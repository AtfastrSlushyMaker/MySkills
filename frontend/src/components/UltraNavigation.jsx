import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navigation() {
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠', color: 'from-blue-500 to-cyan-500' },
        { path: '/login', label: 'Login', icon: '🔐', color: 'from-purple-500 to-pink-500' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊', color: 'from-green-500 to-teal-500' },
        { path: '/courses', label: 'Courses', icon: '📚', color: 'from-orange-500 to-red-500' }
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
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <nav className={`
            sticky top-0 z-50 transition-all duration-500
            ${isScrolled
                ? 'bg-black/80 backdrop-blur-2xl shadow-2xl shadow-purple-500/20'
                : 'bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl'
            }
        `}>
            {/* Animated mesh background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Dynamic background that follows mouse */}
            <div
                className="absolute inset-0 opacity-30 transition-all duration-1000"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`
                }}
            ></div>

            {/* Main navigation content */}
            <div className="relative max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between py-4">

                    {/* Logo Section - Enhanced */}
                    <Link to="/" className="flex items-center space-x-4 group cursor-pointer">
                        <div className="relative">
                            {/* Logo container with multiple effects */}
                            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/10 group-hover:border-white/30 transition-all duration-500 group-hover:scale-110">
                                <img
                                    src="/logos/myskills-logo-icon.png"
                                    alt="MySkills Logo"
                                    className="h-10 w-auto transition-all duration-500 group-hover:rotate-12"
                                />
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/40 to-purple-400/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                            </div>

                            {/* Floating particles around logo */}
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }}></div>
                        </div>

                        {/* Brand text with advanced effects */}
                        <div className="relative">
                            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-cyan-400 transition-all duration-500">
                                MySkills
                            </h1>
                            {/* Subtitle */}
                            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium tracking-wider">
                                TRAINING PLATFORM
                            </p>
                        </div>
                    </Link>

                    {/* Navigation Links - Completely redesigned */}
                    <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
                        {navItems.map((item, index) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        relative px-6 py-3 rounded-xl font-semibold transition-all duration-500 group overflow-hidden
                                        ${isActive
                                            ? 'text-white shadow-lg transform scale-105'
                                            : 'text-gray-300 hover:text-white hover:scale-105'
                                        }
                                    `}
                                    style={{ textDecoration: 'none' }}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    {/* Dynamic background for active/hover state */}
                                    <div className={`
                                        absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl transition-all duration-500
                                        ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'}
                                    `}></div>

                                    {/* Glass effect overlay */}
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Content */}
                                    <div className="relative flex items-center space-x-2">
                                        <span className={`text-xl transition-all duration-300 ${isActive || activeIndex === index ? 'animate-float' : ''}`}>
                                            {item.icon}
                                        </span>
                                        <span className="font-bold tracking-wide">
                                            {item.label}
                                        </span>
                                    </div>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                                    )}

                                    {/* Hover effect particles */}
                                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                        <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.3s' }}></div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Search button */}
                        <button className="relative p-3 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all duration-300 group hover:scale-110">
                            <span className="text-lg">🔍</span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        {/* Notifications */}
                        <button className="relative p-3 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all duration-300 group hover:scale-110">
                            <span className="text-lg">🔔</span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        {/* Profile/Settings */}
                        <button className="relative p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/10 text-white hover:border-white/30 transition-all duration-300 group hover:scale-110">
                            <span className="text-lg">👤</span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom gradient line - Enhanced */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-pulse"></div>
        </nav>
    )
}

export default Navigation
