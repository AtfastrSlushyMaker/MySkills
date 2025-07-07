import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'

function HomePage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.filter(category => category.is_active));
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching categories:', err);
            // Fallback to hardcoded data if API fails
            setCategories([
                { id: 1, name: 'Software Development', description: 'Master modern programming languages and development frameworks', is_active: 1 },
                { id: 2, name: 'Data Science & Analytics', description: 'Learn data analysis, machine learning, and business intelligence', is_active: 1 },
                { id: 3, name: 'Cloud Computing', description: 'Build scalable applications using cloud platforms and services', is_active: 1 },
                { id: 4, name: 'Digital Marketing', description: 'Drive business growth through strategic digital marketing', is_active: 1 },
                { id: 5, name: 'Project Management', description: 'Lead teams and deliver projects using agile methodologies', is_active: 1 },
                { id: 6, name: 'Cybersecurity', description: 'Protect organizations from cyber threats and vulnerabilities', is_active: 1 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Icon mapping for categories
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'Software Development': 'fa-code',
            'Data Science & Analytics': 'fa-chart-bar',
            'Cloud Computing': 'fa-cloud',
            'Digital Marketing': 'fa-bullhorn',
            'Project Management': 'fa-tasks',
            'Cybersecurity': 'fa-shield-alt',
            'Artificial Intelligence': 'fa-brain',
            'Mobile Development': 'fa-mobile-alt',
            'Web Design & UX': 'fa-palette',
            'Business Analytics': 'fa-chart-line',
            'DevOps & Infrastructure': 'fa-cogs',
            'Database Management': 'fa-database',
        };
        return iconMap[categoryName] || 'fa-code';
    };

    // Color schemes for categories
    const getCategoryGradient = (index) => {
        const gradients = [
            'from-cyan-500 to-blue-600',
            'from-purple-500 to-pink-600',
            'from-emerald-500 to-cyan-600',
            'from-orange-500 to-red-600',
            'from-indigo-500 to-purple-600',
            'from-blue-500 to-indigo-600',
            'from-green-500 to-teal-600',
            'from-pink-500 to-red-600',
            'from-yellow-500 to-orange-600',
            'from-violet-500 to-purple-600',
            'from-teal-500 to-green-600',
            'from-red-500 to-pink-600',
        ];
        return gradients[index % gradients.length];
    };
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Stunning Hero Section */}
            <div className="relative z-10">
                {/* Hero Section with Advanced Glassmorphism */}
                <section className="min-h-screen flex items-center justify-center relative px-6">
                    {/* Floating geometric shapes */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
                        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-400/30 to-cyan-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
                    </div>

                    <div className="max-w-6xl mx-auto text-center relative z-10">
                        {/* Logo and Brand */}
                        <div className="mb-8 relative">
                            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl mb-6">
                                <img src="/logos/myskills-logo-icon.png" alt="MySkills" className="w-16 h-16" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl"></div>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-x">
                                MySkills
                            </span>
                            <br />
                            <span className="text-white/90 text-5xl md:text-6xl font-light">Academy</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-2xl md:text-3xl text-white/80 mb-6 max-w-4xl mx-auto leading-relaxed font-light">
                            Transform your career with
                            <span className="text-cyan-400 font-semibold"> world-class training </span>
                            that delivers real results
                        </p>

                        {/* Key Benefits */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <div className="bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/20 text-white/90">
                                <i className="fas fa-star text-cyan-400 mr-2"></i> Expert-Led Courses
                            </div>
                            <div className="bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/20 text-white/90">
                                <i className="fas fa-certificate text-purple-400 mr-2"></i> Industry Certifications
                            </div>
                            <div className="bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/20 text-white/90">
                                <i className="fas fa-rocket text-pink-400 mr-2"></i> Career Advancement
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/login" >
                                <button className="group relative px-12 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25">
                                    <span className="relative z-10">Start Learning Today</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-16 pt-8 border-t border-white/20">
                            <p className="text-white/60 text-sm mb-6">Trusted by professionals at</p>
                            <div className="flex flex-wrap justify-center items-center gap-8">
                                {['Microsoft', 'Google', 'Amazon', 'IBM', 'Oracle', 'Salesforce'].map((company) => (
                                    <div key={company} className="bg-white/5 backdrop-blur-xl px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white/90 hover:bg-white/10 transition-all duration-300">
                                        {company}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { value: '25,000+', label: 'Students Enrolled', icon: 'fa-users', color: 'cyan' },
                                { value: '150+', label: 'Professional Courses', icon: 'fa-graduation-cap', color: 'purple' },
                                { value: `${categories.length}+`, label: 'Learning Categories', icon: 'fa-chart-line', color: 'pink' },
                                { value: '24/7', label: 'Learning Support', icon: 'fa-headset', color: 'emerald' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-${stat.color}-400/20 to-${stat.color}-600/20 backdrop-blur-2xl rounded-2xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                                        <i className={`fas ${stat.icon} text-2xl text-${stat.color}-400`}></i>
                                    </div>
                                    <div className={`text-4xl font-black mb-2 text-${stat.color}-400`}>{stat.value}</div>
                                    <div className="text-white/70 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl font-black mb-6">
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Learning Paths
                                </span>
                            </h2>
                            <p className="text-xl text-white/80 max-w-3xl mx-auto">
                                Choose from our expertly crafted learning paths designed to accelerate your career
                            </p>
                            {error && (
                                <div className="mt-4 p-4 bg-red-500/20 backdrop-blur-xl rounded-xl border border-red-500/30 text-red-200 max-w-md mx-auto">
                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                    Unable to load latest categories. Showing popular paths.
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                // Loading state
                                Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 animate-pulse h-80">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-400/20 mb-6"></div>
                                        <div className="h-6 bg-gray-400/20 rounded mb-4"></div>
                                        <div className="h-20 bg-gray-400/20 rounded mb-6"></div>
                                        <div className="h-12 bg-gray-400/20 rounded"></div>
                                    </div>
                                ))
                            ) : (
                                categories.map((category, index) => {
                                    const gradient = getCategoryGradient(index);
                                    const icon = getCategoryIcon(category.name);

                                    return (
                                        <div key={category.id} className="group relative">
                                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" style={{ background: `linear-gradient(135deg, ${gradient.replace('from-', '').replace(' to-', ', ')})` }}></div>
                                            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:scale-105 shadow-xl h-80 flex flex-col">
                                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                                    <i className={`fas ${icon} text-2xl text-white`}></i>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-4">{category.name}</h3>
                                                <p className="text-white/70 leading-relaxed text-sm flex-grow">{category.description}</p>
                                                <button className="mt-6 w-full py-3 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold transition-all duration-300">
                                                    Explore Path
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>


                {/* CTA Section */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-12 border border-white/20 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
                            <div className="relative z-10">
                                <h2 className="text-5xl font-black mb-6">
                                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        Ready to Transform
                                    </span>
                                    <br />
                                    <span className="text-white">Your Career?</span>
                                </h2>
                                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                    Join thousands of professionals who have accelerated their careers with MySkills Academy
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <Link to="/signup" >

                                        <button className="group relative px-12 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25" >
                                            <span className="relative z-10">Start Your Journey</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </button>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </div >
    )
}

export default HomePage
