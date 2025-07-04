import { Link } from 'react-router-dom'

function Navigation() {
    return (
        <nav style={{ backgroundColor: 'blue', padding: '1rem' }}>
            <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
            <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</Link>
            <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}>Dashboard</Link>
            <Link to="/courses" style={{ color: 'white' }}>Courses</Link>
        </nav>
    )
}

export default Navigation
