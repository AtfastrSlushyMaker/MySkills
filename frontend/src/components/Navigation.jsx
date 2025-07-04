import { Link, useLocation } from 'react-router-dom'

function Navigation() {
    const location = useLocation()

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/login', label: 'Login' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/courses', label: 'Courses' }
    ]

    return (
        <nav className="bg-primary shadow-lg" style={{ backgroundColor: '#1E40AF', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div className="max-w-7xl mx-auto px-6" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                <div className="flex items-center justify-between py-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-3 text-white hover:text-gray-200 transition-colors" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
                        <img
                            src="/logos/myskills-logo-icon.png"
                            alt="MySkills Logo"
                            className="h-10 w-auto"
                            style={{ height: '40px', width: 'auto' }}
                        />
                        <span className="text-xl font-bold" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>MySkills</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-3">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation
