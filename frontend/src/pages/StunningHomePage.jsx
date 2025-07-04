import { useState, useEffect } from 'react'

function StunningHomePage() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const features = [
        {
            icon: '🎯',
            title: 'Course Management',
            description: 'Create and organize training courses with detailed descriptions and categories for effective learning paths.',
            gradient: 'bg-gradient-to-br from-purple-600 to-blue-600',
            delay: '0s'
        },
        {
            icon: '📅',
            title: 'Session Planning',
            description: 'Schedule sessions, assign trainers, and manage training calendars with intelligent resource allocation.',
            gradient: 'bg-gradient-to-br from-blue-600 to-cyan-600',
            delay: '0.1s'
        },
        {
            icon: '👥',
            title: 'User Registration',
            description: 'Handle trainee enrollments with automated approval workflows and waitlist management.',
            gradient: 'bg-gradient-to-br from-cyan-600 to-green-600',
            delay: '0.2s'
        },
        {
            icon: '📊',
            title: 'Attendance Tracking',
            description: 'Monitor participation and generate detailed attendance reports with real-time insights.',
            gradient: 'bg-gradient-to-br from-green-600 to-yellow-600',
            delay: '0.3s'
        },
        {
            icon: '🎓',
            title: 'Skill Development',
            description: 'Track learning progress and skill acquisition with comprehensive assessment tools.',
            gradient: 'bg-gradient-to-br from-yellow-600 to-red-600',
            delay: '0.4s'
        },
        {
            icon: '🔐',
            title: 'Role-based Access',
            description: 'Secure platform with different access levels for administrators, coordinators, trainers, and trainees.',
            gradient: 'bg-gradient-to-br from-red-600 to-purple-600',
            delay: '0.5s'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12 pt-32">
                {/* Hero Section */}
                <div className={`text-center mb-20 ${isVisible ? 'animate-fade-scale' : 'opacity-0'}`}>
                    <div className="mb-8">
                        <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-slide-up">
                            MySkills
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl text-gray-300 font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            Revolutionary Training Management Platform
                        </p>
                    </div>

                    {/* Floating CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover-lift">
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                        <button className="group relative px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full text-purple-400 font-bold text-lg hover:bg-purple-500/10 transition-all duration-300 hover:scale-105 hover-lift">
                            Watch Demo
                            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                    {[
                        { number: '10K+', label: 'Active Users', icon: '👨‍💼' },
                        { number: '500+', label: 'Courses', icon: '📚' },
                        { number: '99.9%', label: 'Uptime', icon: '⚡' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover-lift group">
                            <div className="text-4xl mb-4 group-hover:animate-float">{stat.icon}</div>
                            <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                            <div className="text-gray-400 text-lg">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="mb-20">
                    <h2 className={`text-5xl font-black text-center mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                        Powerful Features
                    </h2>
                    <p className={`text-xl text-gray-400 text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
                        Everything you need to manage training programs effectively
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover-lift cursor-pointer ${isVisible ? 'animate-fade-scale' : 'opacity-0'}`}
                                style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                            >
                                {/* Background gradient on hover */}
                                <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>

                                {/* Icon */}
                                <div className="relative text-6xl mb-6 group-hover:animate-float">
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Hover effect */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className={`text-center p-16 rounded-3xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-lg border border-white/10 ${isVisible ? 'animate-fade-scale' : 'opacity-0'}`} style={{ animationDelay: '2s' }}>
                    <h2 className="text-4xl font-black text-white mb-6">
                        Ready to Transform Your Training?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of organizations using MySkills to deliver exceptional training experiences.
                    </p>
                    <button className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover-lift">
                        <span className="relative z-10">Start Free Trial</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StunningHomePage
