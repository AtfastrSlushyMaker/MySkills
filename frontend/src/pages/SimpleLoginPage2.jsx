function LoginPage() {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Login Page</h1>
            <p>Login functionality will be implemented here.</p>
            <div style={{ marginTop: '2rem' }}>
                <input type="email" placeholder="Email" style={{ margin: '0.5rem', padding: '0.5rem' }} />
                <br />
                <input type="password" placeholder="Password" style={{ margin: '0.5rem', padding: '0.5rem' }} />
                <br />
                <button style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Login
                </button>
            </div>
        </div>
    )
}

export default LoginPage
