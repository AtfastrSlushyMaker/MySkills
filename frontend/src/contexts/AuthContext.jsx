import { createContext, useContext, useState, useEffect } from 'react'
import { setAuthToken } from '../services/api'

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null;
        if (storedToken) {
            setAuthToken(storedToken);
        }
        return storedToken;
    })

    // Set auth token in API service whenever token changes
    useEffect(() => {
        setAuthToken(token)
    }, [token])

    // On mount, always set the token in Axios from storage if it exists
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null;
        if (storedToken) {
            setAuthToken(storedToken);
        }
    }, [])

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
            const response = await fetch(`${API_BASE_URL}/me`, {
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

    const login = async (email, password, rememberMe = false) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()
            if (response.ok) {
                setToken(data.token)
                setUser(data.user)
                setAuthToken(data.token) // <-- Ensure Axios always has the token after login
                if (rememberMe) {
                    localStorage.setItem('auth_token', data.token)
                    sessionStorage.removeItem('auth_token')
                } else {
                    sessionStorage.setItem('auth_token', data.token)
                    localStorage.removeItem('auth_token')
                }
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
            const response = await fetch(`${API_BASE_URL}/register`, {
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
                setToken(data.token)
                setUser(data.user)
                localStorage.setItem('auth_token', data.token)
                sessionStorage.removeItem('auth_token')
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
                await fetch(`${API_BASE_URL}/logout`, {
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
            setUser(null)
            setToken(null)
            localStorage.removeItem('auth_token')
            sessionStorage.removeItem('auth_token')
        }
    }

    const updateUser = (userData) => {
        setUser(userData)
    }

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
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
