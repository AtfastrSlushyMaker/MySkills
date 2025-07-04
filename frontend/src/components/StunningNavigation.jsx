import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navigation() {
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState(false)

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/login', label: 'Login', icon: '🔐' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/courses', label: 'Courses', icon: '📚' }
    ]

    return (
        <nav className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 shadow-2xl">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>

            {/* Glass overlay */}
            <div className="absolute inset-0 glass"></div>

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between py-4">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-4 text-white hover:text-blue-200 transition-all duration-300 group">
                        <div className="relative">
                            <img
                                src="/logos/myskills-logo-icon.png"
                                alt="MySkills Logo"
                                className="h-12 w-auto animate-float group-hover:animate-glow transition-all duration-300"
                                style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }}
                            />
                            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-400/40 transition-all duration-300"></div>
                        </div>
                        <div className="text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                            MySkills
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    relative px-6 py-3 rounded-full font-semibold transition-all duration-300
                                    hover:scale-105 hover:shadow-lg hover-lift
                                    ${location.pathname === item.path
                                        ? 'bg-white/20 text-white shadow-lg animate-glow'
                                        : 'text-gray-200 hover:text-white hover:bg-white/10'
                                    }
                                `}
                                style={{
                                    textDecoration: 'none',
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <span className="mr-2 text-lg">{item.icon}</span>
                                {item.label}

                                {/* Active indicator */}
                                {location.pathname === item.path && (
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
        </nav>
    )
}

export default Navigation
