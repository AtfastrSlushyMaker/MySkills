function SessionsPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-xl mb-6">
                        <span className="text-4xl">📚</span>
                    </div>
                    <h1 className="text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                            Course Catalog
                        </span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        Explore our comprehensive collection of professional development courses designed to accelerate your career
                    </p>
                </div>

                {/* Filter Section */}
                <div className="mb-16">
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl">
                        <div className="flex flex-wrap justify-center gap-4">
                            {['All Courses', 'Tech Leadership', 'Development', 'Data Science', 'Design', 'Marketing', 'Product'].map((filter) => (
                                <button key={filter} className="px-6 py-3 bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 backdrop-blur-xl rounded-full border border-white/20 hover:border-white/40 text-white transition-all duration-300 hover:scale-105">
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Advanced React & TypeScript',
                            instructor: 'Sarah Chen',
                            duration: '8 weeks',
                            level: 'Advanced',
                            rating: 4.9,
                            students: 2547,
                            price: '$299',
                            image: '⚛️',
                            gradient: 'from-cyan-500 to-blue-600',
                            tags: ['React', 'TypeScript', 'Frontend']
                        },
                        {
                            title: 'Machine Learning Fundamentals',
                            instructor: 'Dr. Alex Kumar',
                            duration: '12 weeks',
                            level: 'Intermediate',
                            rating: 4.8,
                            students: 3241,
                            price: '$399',
                            image: '🤖',
                            gradient: 'from-purple-500 to-pink-600',
                            tags: ['ML', 'Python', 'AI']
                        },
                        {
                            title: 'Tech Leadership Mastery',
                            instructor: 'Marcus Rodriguez',
                            duration: '6 weeks',
                            level: 'Expert',
                            rating: 4.9,
                            students: 1876,
                            price: '$499',
                            image: '👑',
                            gradient: 'from-emerald-500 to-cyan-600',
                            tags: ['Leadership', 'Management', 'Strategy']
                        },
                        {
                            title: 'Full-Stack Web Development',
                            instructor: 'Emily Watson',
                            duration: '16 weeks',
                            level: 'Beginner',
                            rating: 4.7,
                            students: 4532,
                            price: '$349',
                            image: '💻',
                            gradient: 'from-orange-500 to-red-600',
                            tags: ['Full-Stack', 'JavaScript', 'Node.js']
                        },
                        {
                            title: 'Cloud Architecture & AWS',
                            instructor: 'David Park',
                            duration: '10 weeks',
                            level: 'Advanced',
                            rating: 4.8,
                            students: 2156,
                            price: '$449',
                            image: '☁️',
                            gradient: 'from-indigo-500 to-purple-600',
                            tags: ['AWS', 'Cloud', 'DevOps']
                        },
                        {
                            title: 'UX/UI Design Principles',
                            instructor: 'Jessica Lee',
                            duration: '8 weeks',
                            level: 'Intermediate',
                            rating: 4.9,
                            students: 3892,
                            price: '$279',
                            image: '🎨',
                            gradient: 'from-pink-500 to-purple-600',
                            tags: ['Design', 'UX', 'Figma']
                        }
                    ].map((course, index) => (
                        <div key={index} className="group relative">
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl" style={{ background: `linear-gradient(135deg, ${course.gradient.replace('from-', '').replace(' to-', ', ')})` }}></div>

                            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:scale-105 shadow-xl">
                                {/* Course Header */}
                                <div className={`p-6 bg-gradient-to-r ${course.gradient} relative`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-6xl">{course.image}</div>
                                        <div className="bg-white/20 backdrop-blur-xl px-3 py-1 rounded-full text-white text-sm font-semibold">
                                            {course.level}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                                    <p className="text-white/90">by {course.instructor}</p>
                                </div>

                                {/* Course Content */}
                                <div className="p-6">
                                    {/* Stats */}
                                    <div className="flex items-center justify-between mb-4 text-sm text-white/80">
                                        <div className="flex items-center">
                                            <span className="text-yellow-400 mr-1">⭐</span>
                                            {course.rating} ({course.students.toLocaleString()})
                                        </div>
                                        <div>{course.duration}</div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {course.tags.map((tag, i) => (
                                            <span key={i} className="bg-white/10 backdrop-blur-xl px-3 py-1 rounded-full text-white/90 text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Price and CTA */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-white">{course.price}</div>
                                        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Section */}
                <div className="text-center mt-16">
                    <button className="px-12 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/20 hover:border-white/40 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-xl">
                        Load More Courses
                    </button>
                </div>

                {/* Learning Paths CTA */}
                <div className="mt-24">
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-12 border border-white/20 shadow-2xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl font-black mb-6">
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Not sure where to start?
                                </span>
                            </h2>
                            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                Take our skills assessment and get personalized learning path recommendations
                            </p>
                            <button className="group relative px-12 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-105 transform transition-all duration-300 shadow-2xl">
                                <span className="relative z-10">Take Skills Assessment</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionsPage
