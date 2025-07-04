import { Routes, Route } from 'react-router-dom'

function TestApp() {
    return (
        <div>
            <nav style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '1rem' }}>
                <h1>MySkills</h1>
            </nav>

            <main style={{ padding: '2rem' }}>
                <Routes>
                    <Route path="/" element={
                        <div>
                            <h1>Welcome to MySkills!</h1>
                            <p>This is the homepage.</p>
                        </div>
                    } />
                    <Route path="/login" element={
                        <div>
                            <h1>Login</h1>
                            <p>Login page content.</p>
                        </div>
                    } />
                    <Route path="*" element={
                        <div>
                            <h1>404 - Page Not Found</h1>
                        </div>
                    } />
                </Routes>
            </main>
        </div>
    )
}

export default TestApp
