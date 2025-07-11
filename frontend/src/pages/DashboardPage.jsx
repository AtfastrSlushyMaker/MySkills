import { useAuth } from '../contexts/AuthContext'
import CoordinatorDashboard from '../components/CoordinatorDashboard'
import TrainerDashboard from '../components/TrainerDashboard'
import TraineeDashboard from '../components/TraineeDashboard'
function DashboardPage() {
    const { user, loading } = useAuth()

    // Show loading while user data is being fetched
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20">
                    <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white text-center">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    // Redirect to login if no user
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 text-center">
                    <p className="text-white mb-4">Please log in to access your dashboard</p>
                    <a href="/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white">
                        Go to Login
                    </a>
                </div>
            </div>
        )
    }

    // Now safely check user.role
    if (user.role === 'coordinator') {
        return <CoordinatorDashboard />
    }
    if (user.role === 'trainer') {
        return <TrainerDashboard />
    } else { // Default to Trainee Dashboard
        return <TraineeDashboard />;
    }
}

export default DashboardPage
