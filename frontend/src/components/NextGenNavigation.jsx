import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function NextGenNavigation() {
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [hoveredItem, setHoveredItem] = useState(null)
    const [particles, setParticles] = useState([])
    const navRef = useRef(null)
    const [time, setTime] = useState(0)

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠', color: 'from-blue-500 to-cyan-500', accent: '#3b82f6' },
        { path: '/login', label: 'Login', icon: '🔐', color: 'from-purple-500 to-pink-500', accent: '#8b5cf6' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊', color: 'from-green-500 to-teal-500', accent: '#10b981' },
        { path: '/courses', label: 'Courses', icon: '📚', color: 'from-orange-500 to-red-500', accent: '#f59e0b' }
    ]

    // Initialize particles
    useEffect(() => {
        const initParticles = []
        for (let i = 0; i < 50; i++) {
            initParticles.push({
                id: i,
                x: Math.random() * window.innerWidth,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.5 + 0.2,
                color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
            })
        }
        setParticles(initParticles)
    }, [])

    // Animate particles
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => prev.map(particle => ({
                ...particle,
                x: particle.x + particle.speedX,
                y: particle.y + particle.speedY,
                x: particle.x > window.innerWidth ? -10 : particle.x < -10 ? window.innerWidth : particle.x,
                y: particle.y > 100 ? -10 : particle.y
            })))
        }, 16)
        return () => clearInterval(interval)
    }, [])

    // Time animation for wave effects
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => prev + 0.02)
        }, 16)
        return () => clearInterval(interval)
    }, [])

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

    // Magnetic effect calculation
    const calculateMagneticOffset = (elementRef, intensity = 0.3) => {
        if (!elementRef || !mousePosition.x) return { x: 0, y: 0 }

        const rect = elementRef.getBoundingClientRect()
        const elementCenterX = rect.left + rect.width / 2
        const elementCenterY = rect.top + rect.height / 2

        const deltaX = mousePosition.x - (elementCenterX - navRef.current?.getBoundingClientRect().left || 0)
        const deltaY = mousePosition.y - (elementCenterY - navRef.current?.getBoundingClientRect().top || 0)

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const maxDistance = 150

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            return {
                x: deltaX * force * intensity,
                y: deltaY * force * intensity
            }
        }
        return { x: 0, y: 0 }
    }

    return (
        <nav
            ref={navRef}
            className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-700 overflow-hidden
                ${isScrolled
                    ? 'bg-black/70 backdrop-blur-3xl shadow-2xl shadow-purple-500/30 border-b border-white/10'
                    : 'bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-2xl'
                }
            `}
            style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
        >
            {/* Animated particle system */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${particle.x}px`,
                            top: `${particle.y}px`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            opacity: particle.opacity,
                            filter: 'blur(0.5px)',
                            animation: `float 3s infinite ease-in-out`,
                            animationDelay: `${particle.id * 0.1}s`
                        }}
                    />
                ))}
            </div>

            {/* Dynamic wave background */}
            <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                        d={`M0,10 Q25,${8 + Math.sin(time) * 2} 50,10 T100,10 V20 H0 Z`}
                        fill="url(#waveGradient)"
                        className="transition-all duration-1000"
                    />
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Magnetic mouse follower */}
            <div
                className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-300 ease-out"
                style={{
                    left: `${mousePosition.x - 192}px`,
                    top: `${mousePosition.y - 192}px`,
                    background: `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)`,
                    filter: 'blur(40px)',
                    transform: `scale(${hoveredItem ? 1.5 : 1})`
                }}
            />

            {/* Main content container */}
            <div className="relative max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between py-4">

                    {/* Enhanced Logo with magnetic effect */}
                    <Link to="/" className="flex items-center space-x-4 group cursor-pointer relative">
                        <div
                            className="relative transition-all duration-300 ease-out"
                            style={{
                                transform: `translate(${calculateMagneticOffset(null, 0.2).x}px, ${calculateMagneticOffset(null, 0.2).y}px)`
                            }}
                        >
                            {/* Multi-layer logo container */}
                            <div className="relative p-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-2xl border border-white/20 group-hover:border-white/40 transition-all duration-500 group-hover:scale-110">
                                <img
                                    src="/logos/myskills-logo-icon.png"
                                    alt="MySkills Logo"
                                    className="h-12 w-auto transition-all duration-700 group-hover:rotate-12 group-hover:scale-110"
                                    style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))' }}
                                />

                                {/* Orbital rings */}
                                <div className="absolute inset-0 rounded-3xl border border-blue-400/30 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '8s' }}></div>
                                <div className="absolute inset-1 rounded-3xl border border-purple-400/30 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>

                                {/* Energy pulses */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/40 to-purple-400/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse -z-10"></div>
                            </div>

                            {/* Advanced floating elements */}
                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                            <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-600 animate-ping" style={{ animationDelay: '0.6s' }}></div>
                        </div>

                        {/* Enhanced brand text */}
                        <div className="relative">
                            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-cyan-400 transition-all duration-700">
                                MySkills
                            </h1>
                            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-bold tracking-[0.2em] uppercase">
                                Next-Gen Platform
                            </p>

                            {/* Text glow effect */}
                            <div className="absolute inset-0 text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm -z-10">
                                MySkills
                            </div>
                        </div>
                    </Link>

                    {/* Revolutionary navigation items */}
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-2xl rounded-3xl p-3 border border-white/20" style={{ backdropFilter: 'blur(20px) saturate(180%)' }}>
                        {navItems.map((item, index) => {
                            const isActive = location.pathname === item.path
                            const magneticOffset = calculateMagneticOffset(null, 0.15)

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredItem(index)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div
                                        className={`
                                            relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 overflow-hidden cursor-pointer
                                            ${isActive
                                                ? 'text-white shadow-2xl transform scale-110'
                                                : 'text-gray-300 hover:text-white hover:scale-105'
                                            }
                                        `}
                                        style={{
                                            transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px) scale(${hoveredItem === index ? 1.1 : isActive ? 1.05 : 1})`
                                        }}
                                    >
                                        {/* Multi-layer background system */}
                                        <div className={`
                                            absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl transition-all duration-700
                                            ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-90 group-hover:scale-100'}
                                        `}></div>

                                        {/* Glass morphism overlay */}
                                        <div className="absolute inset-0 bg-white/20 backdrop-blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                        {/* Animated border */}
                                        <div className={`
                                            absolute inset-0 rounded-2xl border-2 transition-all duration-500
                                            ${isActive
                                                ? 'border-white/50'
                                                : 'border-transparent group-hover:border-white/30'
                                            }
                                        `}></div>

                                        {/* Content with enhanced effects */}
                                        <div className="relative flex items-center space-x-3 z-10">
                                            <span
                                                className={`text-2xl transition-all duration-500 ${isActive || hoveredItem === index
                                                        ? 'animate-bounce scale-110'
                                                        : 'group-hover:scale-110'
                                                    }`}
                                                style={{
                                                    filter: `drop-shadow(0 0 ${hoveredItem === index ? '15px' : '0px'} ${item.accent})`
                                                }}
                                            >
                                                {item.icon}
                                            </span>
                                            <span className="font-black tracking-wide text-sm uppercase">
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* Active pulse indicator */}
                                        {isActive && (
                                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        )}

                                        {/* Hover particle effects */}
                                        {hoveredItem === index && (
                                            <>
                                                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping"></div>
                                                <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="absolute bottom-1 left-3 w-1 h-1 bg-white/70 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                                                <div className="absolute bottom-2 right-1 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                                            </>
                                        )}

                                        {/* Advanced glow effect */}
                                        <div
                                            className={`
                                                absolute inset-0 rounded-2xl blur-xl transition-all duration-500 -z-10
                                                ${hoveredItem === index ? 'opacity-60' : 'opacity-0'}
                                            `}
                                            style={{
                                                background: `linear-gradient(45deg, ${item.accent}40, ${item.accent}20)`
                                            }}
                                        ></div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Next-level action buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Advanced search with sound waves */}
                        <button className="relative p-4 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all duration-500 group hover:scale-110 overflow-hidden">
                            <span className="text-xl relative z-10">🔍</span>

                            {/* Sound wave animation */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute inset-0 border border-blue-400/30 rounded-2xl animate-ping"
                                        style={{ animationDelay: `${i * 0.3}s`, animationDuration: '2s' }}
                                    />
                                ))}
                            </div>

                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>

                        {/* Smart notifications */}
                        <button className="relative p-4 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all duration-500 group hover:scale-110">
                            <span className="text-xl relative z-10">🔔</span>

                            {/* Notification pulse */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>

                            {/* Ripple effect */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500/30 rounded-full animate-ping"></div>

                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>

                        {/* Premium profile button */}
                        <button className="relative p-4 rounded-2xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-2xl border border-white/30 text-white hover:border-white/50 transition-all duration-500 group hover:scale-110 overflow-hidden">
                            <span className="text-xl relative z-10">👤</span>

                            {/* Rotating border */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-spin" style={{ animationDuration: '3s' }}></div>

                            {/* Premium glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Multi-layer bottom effects */}
            <div className="absolute bottom-0 left-0 right-0">
                {/* Primary gradient line */}
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80"></div>

                {/* Animated secondary line */}
                <div className="h-px bg-gradient-to-r from-blue-500 via-purple-500 via-cyan-500 to-blue-500 animate-pulse"></div>

                {/* Flowing particles line */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
            </div>
        </nav>
    )
}

export default NextGenNavigation
