function DashboardPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Welcome Header */}
                <div className="mb-12">
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h1 className="text-5xl font-black mb-4">
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Welcome Back
                                </span>
                            </h1>
                            <p className="text-xl text-white/80">Continue your learning journey and track your progress</p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">                {[
                    { label: 'Courses Enrolled', value: '8', icon: 'fas fa-book-open', color: 'cyan', change: '+2 this month' },
                    { label: 'Completed', value: '5', icon: 'fas fa-graduation-cap', color: 'purple', change: '+1 this week' },
                    { label: 'Learning Hours', value: '42', icon: 'fas fa-clock', color: 'pink', change: '+8 this week' },
                    { label: 'Certificates', value: '3', icon: 'fas fa-trophy', color: 'emerald', change: '+1 this month' }
                ].map((stat, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-400/20 to-${stat.color}-600/20 rounded-2xl flex items-center justify-center`}>
                                <i className={`${stat.icon} text-xl text-${stat.color}-400`}></i>
                            </div>
                            <div className={`text-3xl font-black text-${stat.color}-400`}>{stat.value}</div>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{stat.label}</h3>
                        <p className="text-white/60 text-sm">{stat.change}</p>
                    </div>
                ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Current Courses */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl">
                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                                <i className="fas fa-book-reader text-cyan-400 mr-3"></i>
                                Current Courses
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: 'Advanced React Development',
                                        progress: 75,
                                        instructor: 'Sarah Chen',
                                        nextLesson: 'State Management with Redux',
                                        gradient: 'from-cyan-500 to-blue-600'
                                    },
                                    {
                                        title: 'Machine Learning Fundamentals',
                                        progress: 45,
                                        instructor: 'Dr. Alex Kumar',
                                        nextLesson: 'Neural Networks Basics',
                                        gradient: 'from-purple-500 to-pink-600'
                                    },
                                    {
                                        title: 'Cloud Architecture & AWS',
                                        progress: 60,
                                        instructor: 'David Park',
                                        nextLesson: 'Auto Scaling Groups',
                                        gradient: 'from-emerald-500 to-cyan-600'
                                    }
                                ].map((course, index) => (
                                    <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                                                <p className="text-white/70">by {course.instructor}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-white">{course.progress}%</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${course.gradient} transition-all duration-500`}
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white/80 text-sm">Next: {course.nextLesson}</p>
                                            </div>
                                            <button className={`px-4 py-2 bg-gradient-to-r ${course.gradient} rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300`}>
                                                Continue
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Learning Streak */}
                        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="fas fa-fire text-orange-400 mr-2"></i>
                                Learning Streak
                            </h3>
                            <div className="text-center">
                                <div className="text-4xl font-black text-orange-400 mb-2">12</div>
                                <p className="text-white/80">Days in a row</p>
                                <div className="mt-4 flex justify-center space-x-1">
                                    {[...Array(7)].map((_, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-full ${i < 5 ? 'bg-orange-400' : 'bg-white/20'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="fas fa-trophy text-yellow-400 mr-2"></i>
                                Recent Achievements
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { title: 'React Master', date: '2 days ago', icon: 'fab fa-react' },
                                    { title: 'Quick Learner', date: '1 week ago', icon: 'fas fa-bolt' },
                                    { title: 'First Certificate', date: '2 weeks ago', icon: 'fas fa-certificate' }
                                ].map((achievement, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                                        <div className="text-xl text-blue-400">
                                            <i className={achievement.icon}></i>
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">{achievement.title}</div>
                                            <div className="text-white/60 text-sm">{achievement.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105">
                                    Browse Courses
                                </button>
                                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300">
                                    View Certificates
                                </button>
                                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300">
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Courses */}
                <div className="mt-12">                        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                        <i className="fas fa-lightbulb text-yellow-400 mr-3"></i>
                        Recommended for You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Advanced TypeScript',
                                description: 'Deep dive into TypeScript advanced features',
                                level: 'Advanced',
                                duration: '6 weeks',
                                rating: 4.9,
                                icon: 'fab fa-js-square',
                                gradient: 'from-blue-500 to-indigo-600'
                            },
                            {
                                title: 'System Design',
                                description: 'Learn to design scalable distributed systems',
                                level: 'Expert',
                                duration: '8 weeks',
                                rating: 4.8,
                                icon: 'fas fa-project-diagram',
                                gradient: 'from-green-500 to-emerald-600'
                            },
                            {
                                title: 'DevOps & CI/CD',
                                description: 'Master modern deployment and automation',
                                level: 'Intermediate',
                                duration: '4 weeks',
                                rating: 4.7,
                                icon: 'fas fa-tools',
                                gradient: 'from-orange-500 to-red-600'
                            }
                        ].map((course, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105">
                                <div className={`w-12 h-12 bg-gradient-to-r ${course.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                                    <i className={`${course.icon} text-2xl text-white`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                                <p className="text-white/70 mb-4">{course.description}</p>
                                <div className="flex items-center justify-between mb-4 text-sm text-white/80">
                                    <span>{course.level}</span>
                                    <span>{course.duration}</span>
                                    <span>⭐ {course.rating}</span>
                                </div>
                                <button className={`w-full py-3 px-4 bg-gradient-to-r ${course.gradient} rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300`}>
                                    Enroll Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
