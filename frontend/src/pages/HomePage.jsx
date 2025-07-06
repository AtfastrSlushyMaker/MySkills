function HomePage() {
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
                                <span className="text-cyan-400">✨</span> Expert-Led Courses
                            </div>
                            <div className="bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/20 text-white/90">
                                <span className="text-purple-400">🏆</span> Industry Certifications
                            </div>
                            <div className="bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/20 text-white/90">
                                <span className="text-pink-400">🚀</span> Career Advancement
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <button className="group relative px-12 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25">
                                <span className="relative z-10">Start Learning Today</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button className="px-12 py-5 text-lg font-semibold text-white bg-white/10 backdrop-blur-2xl hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl">
                                Watch Demo
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-16 pt-8 border-t border-white/20">
                            <p className="text-white/60 text-sm mb-6">Trusted by professionals at</p>
                            <div className="flex flex-wrap justify-center items-center gap-8">
                                {['Microsoft', 'Google', 'Amazon', 'Apple', 'Meta', 'Tesla'].map((company) => (
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
                                { value: '50K+', label: 'Students Trained', icon: '👥', color: 'cyan' },
                                { value: '200+', label: 'Expert Courses', icon: '📚', color: 'purple' },
                                { value: '98%', label: 'Success Rate', icon: '🎯', color: 'pink' },
                                { value: '24/7', label: 'Support', icon: '🤝', color: 'emerald' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-${stat.color}-400/20 to-${stat.color}-600/20 backdrop-blur-2xl rounded-2xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                                        <span className="text-3xl">{stat.icon}</span>
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Tech Leadership',
                                    description: 'Master technical leadership, architecture design, and team management',
                                    icon: '⚡',
                                    gradient: 'from-cyan-500 to-blue-600',
                                    features: ['System Design', 'Team Leadership', 'Strategic Planning']
                                },
                                {
                                    title: 'Full-Stack Development',
                                    description: 'Build modern web applications with cutting-edge technologies',
                                    icon: '💻',
                                    gradient: 'from-purple-500 to-pink-600',
                                    features: ['React & Vue', 'Node.js & Python', 'Cloud Deployment']
                                },
                                {
                                    title: 'Data Science & AI',
                                    description: 'Harness the power of data and artificial intelligence',
                                    icon: '🧠',
                                    gradient: 'from-emerald-500 to-cyan-600',
                                    features: ['Machine Learning', 'Data Analysis', 'AI Implementation']
                                },
                                {
                                    title: 'Digital Marketing',
                                    description: 'Drive growth through strategic digital marketing campaigns',
                                    icon: '📈',
                                    gradient: 'from-orange-500 to-red-600',
                                    features: ['SEO & SEM', 'Social Media', 'Analytics']
                                },
                                {
                                    title: 'Product Management',
                                    description: 'Lead product strategy and drive business outcomes',
                                    icon: '🎯',
                                    gradient: 'from-indigo-500 to-purple-600',
                                    features: ['Product Strategy', 'User Research', 'Agile Methods']
                                },
                                {
                                    title: 'Cloud Architecture',
                                    description: 'Design and deploy scalable cloud infrastructure',
                                    icon: '☁️',
                                    gradient: 'from-blue-500 to-indigo-600',
                                    features: ['AWS & Azure', 'DevOps', 'Security']
                                }
                            ].map((path, index) => (
                                <div key={index} className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" style={{ background: `linear-gradient(135deg, ${path.gradient.replace('from-', '').replace(' to-', ', ')})` }}></div>
                                    <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:scale-105 shadow-xl">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${path.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                            <span className="text-3xl">{path.icon}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-4">{path.title}</h3>
                                        <p className="text-white/70 mb-6 leading-relaxed">{path.description}</p>
                                        <ul className="space-y-2">
                                            {path.features.map((feature, i) => (
                                                <li key={i} className="text-white/80 flex items-center">
                                                    <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3"></span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="mt-6 w-full py-3 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold transition-all duration-300">
                                            Explore Path
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl font-black mb-6">
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Success Stories
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: 'Sarah Chen',
                                    role: 'Senior Developer at Google',
                                    image: '👩‍💻',
                                    quote: 'MySkills Academy transformed my career. The hands-on approach and expert mentorship helped me land my dream job.',
                                    course: 'Full-Stack Development'
                                },
                                {
                                    name: 'Marcus Rodriguez',
                                    role: 'Product Manager at Meta',
                                    image: '👨‍💼',
                                    quote: 'The product management course gave me the skills and confidence to lead cross-functional teams effectively.',
                                    course: 'Product Management'
                                },
                                {
                                    name: 'Emily Watson',
                                    role: 'Data Scientist at Microsoft',
                                    image: '👩‍🔬',
                                    quote: 'From zero to data scientist in 6 months. The curriculum is perfectly structured for career changers.',
                                    course: 'Data Science & AI'
                                }
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 shadow-xl">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-white/20">
                                            {testimonial.image}
                                        </div>
                                        <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                                        <p className="text-cyan-400 font-medium">{testimonial.role}</p>
                                    </div>
                                    <blockquote className="text-white/80 italic mb-4 leading-relaxed">
                                        "{testimonial.quote}"
                                    </blockquote>
                                    <div className="text-center">
                                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text font-semibold">
                                            {testimonial.course}
                                        </span>
                                    </div>
                                </div>
                            ))}
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
                                    <button className="group relative px-12 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25">
                                        <span className="relative z-10">Start Your Journey</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                    <button className="px-12 py-5 text-lg font-semibold text-white bg-white/10 backdrop-blur-2xl hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl">
                                        Free Trial
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default HomePage
