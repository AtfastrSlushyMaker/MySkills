function HomePage() {
    return (
        <div className="max-w-7xl mx-auto px-6" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary to-blue-500 rounded-2xl p-16 text-center text-white mb-8 shadow-xl" style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', borderRadius: '1rem', padding: '4rem', textAlign: 'center', color: 'white', marginBottom: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <h1 className="text-5xl font-bold mb-4" style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>MySkills</h1>
                <p className="text-xl opacity-90" style={{ fontSize: '1.25rem', opacity: '0.9' }}>Training Management Platform</p>
            </div>

            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border">
                <h2 className="text-3xl font-bold text-primary mb-4">Welcome to MySkills</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Navigate using the buttons above to explore our comprehensive training management platform designed for modern learning and skill development.
                </p>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border">
                <h2 className="text-3xl font-bold text-primary mb-6">About MySkills</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    MySkills is a comprehensive training management platform designed for <span className="font-semibold text-primary">SMART SKILLS</span>.
                    Our platform digitalizes the entire training process from course creation to attendance tracking,
                    providing a seamless experience for administrators, coordinators, trainers, and trainees.
                </p>

                <h3 className="text-2xl font-bold text-primary mb-8">Key Features:</h3>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Course Management */}
                    <div className="feature-card">
                        <div className="w-12 h-12 bg-accent-green rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">📚</span>
                        </div>
                        <h4 className="text-xl font-semibold text-accent-green mb-3">Course Management</h4>
                        <p className="text-gray-600 leading-relaxed">
                            Create and organize training courses with detailed descriptions and categories for effective learning paths.
                        </p>
                    </div>

                    {/* Session Planning */}
                    <div className="feature-card">
                        <div className="w-12 h-12 bg-accent-blue rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h4 className="text-xl font-semibold text-accent-blue mb-3">Session Planning</h4>
                        <p className="text-gray-600 leading-relaxed">
                            Schedule sessions, assign trainers, and manage training calendars with intelligent resource allocation.
                        </p>
                    </div>

                    {/* User Registration */}
                    <div className="feature-card">
                        <div className="w-12 h-12 bg-accent-orange rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">👥</span>
                        </div>
                        <h4 className="text-xl font-semibold text-accent-orange mb-3">User Registration</h4>
                        <p className="text-gray-600 leading-relaxed">
                            Handle trainee enrollments with automated approval workflows and waitlist management.
                        </p>
                    </div>

                    {/* Attendance Tracking */}
                    <div className="feature-card">
                        <div className="w-12 h-12 bg-accent-purple rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h4 className="text-xl font-semibold text-accent-purple mb-3">Attendance Tracking</h4>
                        <p className="text-gray-600 leading-relaxed">
                            Monitor participation and generate detailed attendance reports with real-time insights.
                        </p>
                    </div>

                    {/* Role-based Access */}
                    <div className="feature-card">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Role-based Access</h4>
                        <p className="text-gray-600 leading-relaxed">
                            Secure access control for Admin, Coordinator, Trainer, and Trainee roles with granular permissions.
                        </p>
                    </div>

                    {/* Analytics & Reports */}
                    <div className="feature-card">
                        <div className="w-12 h-12 bg-accent-green rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h4 className="text-xl font-semibold text-accent-green mb-3">Analytics & Reports</h4>
                        <p className="text-gray-600 leading-relaxed">
                            Comprehensive training insights and performance analytics with customizable dashboards.
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-gradient-to-r rounded-xl p-8 text-center text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Training?</h3>
                <p className="text-lg mb-6 opacity-90">
                    Join thousands of organizations using MySkills to enhance their training programs.
                </p>
                <div className="flex flex-col gap-4 justify-center" style={{ gap: '1rem' }}>
                    <button className="btn btn-primary">
                        Get Started
                    </button>
                    <button className="btn btn-secondary">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HomePage
