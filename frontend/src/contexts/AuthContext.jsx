import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem('auth_token'))

    // Check if user is authenticated on app start
    useEffect(() => {
        if (token) {
            // Verify token with backend
            verifyToken()
        } else {
            setLoading(false)
        }
    }, [token])

    const verifyToken = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            } else {
                // Token is invalid
                logout()
            }
        } catch (error) {
            console.error('Token verification failed:', error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (response.ok) {
                // Store token and user data
                setToken(data.token)
                setUser(data.user)
                localStorage.setItem('auth_token', data.token)
                return { success: true, user: data.user }
            } else {
                return { success: false, message: data.message || 'Login failed' }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, message: 'Network error. Please try again.' }
        }
    }

    const register = async (userData) => {
        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            })

            const data = await response.json()

            if (response.ok) {
                // Auto-login after successful registration
                setToken(data.token)
                setUser(data.user)
                localStorage.setItem('auth_token', data.token)
                return { success: true, user: data.user }
            } else {
                return { success: false, message: data.message || 'Registration failed', errors: data.errors }
            }
        } catch (error) {
            console.error('Registration error:', error)
            return { success: false, message: 'Network error. Please try again.' }
        }
    }

    const logout = async () => {
        try {
            if (token) {
                await fetch('http://localhost:8000/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                })
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Clear local state regardless of API call success
            setUser(null)
            setToken(null)
            localStorage.removeItem('auth_token')
        }
    }

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isTrainer: user?.role === 'trainer',
        isCoordinator: user?.role === 'coordinator',
        isTrainee: user?.role === 'trainee'
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
