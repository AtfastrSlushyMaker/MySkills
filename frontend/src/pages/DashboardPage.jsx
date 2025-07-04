function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your MySkills dashboard!</p>

            <div style={{ margin: '20px 0' }}>
                <h3>Quick Stats:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div style={{
                        backgroundColor: '#f0f9ff',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #1E40AF'
                    }}>
                        <h4>Total Courses</h4>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E40AF' }}>15</p>
                    </div>

                    <div style={{
                        backgroundColor: '#f0fdf4',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #22c55e'
                    }}>
                        <h4>Active Sessions</h4>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>8</p>
                    </div>

                    <div style={{
                        backgroundColor: '#fef2f2',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #ef4444'
                    }}>
                        <h4>Registered Users</h4>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>156</p>
                    </div>
                </div>
            </div>

            <div style={{ margin: '30px 0' }}>
                <h3>Recent Activities</h3>
                <ul>
                    <li>John Doe enrolled in "React Fundamentals" course</li>
                    <li>New session "Laravel API Development" scheduled for tomorrow</li>
                    <li>5 students completed "JavaScript Basics" course</li>
                </ul>
            </div>
        </div>
    )
}

export default DashboardPage
