import { useState } from 'react'

function LoginForm() {
    // State for form inputs
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault() // Prevent page refresh
        console.log('Login attempt:', { email, password })
        // TODO: Later we'll send this to your Laravel API
    }

    return (
        <div style={{
            maxWidth: '400px',
            margin: '50px auto',
            padding: '30px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
        }}>
            <h2>Login to MySkills</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Password:
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1E40AF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginForm
