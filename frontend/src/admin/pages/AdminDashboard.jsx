import React from "react";
import { userApi, categoryApi, trainingCourseApi, trainingSessionApi } from "../../services/api";


const fetchData = async () => {
    try {
        const [users, categories, courses, sessions] = await Promise.all([
            userApi.getUserCount(),
            categoryApi.getAllCategories(),
            trainingCourseApi.getAllCourses(),
            trainingSessionApi.getAllSessions()
        ]);
        return {
            totalUsers: users.data.count,
            totalCategories: categories.data.length,
            totalCourses: courses.data.length,
            totalSessions: sessions.data.length
        };
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
}


function StatCard({ title, value, icon, trend = "+12%", isLight }) {
    return (
        <div className={
            `group relative overflow-hidden rounded-3xl border shadow-2xl transition-all duration-500 hover:scale-105 ` +
            (isLight
                ? "bg-white/90 border-blue-100 hover:border-blue-300 hover:shadow-blue-200/40"
                : "bg-white/5 backdrop-blur-xl border-white/10 hover:border-cyan-400/30 hover:shadow-cyan-500/10")
        }>
            <div className={isLight
                ? "absolute inset-0 bg-gradient-to-br from-blue-200/10 to-blue-400/10 opacity-100"
                : "absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            }></div>
            <div className="relative flex items-center gap-5 p-7">
                <div className={isLight
                    ? "flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-200/40 to-blue-400/30 border border-blue-200 text-blue-400"
                    : "flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30"
                }>
                    <i className={`${icon} text-2xl ${isLight ? "text-blue-400" : "text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300"}`}></i>
                </div>
                <div className="flex-1">
                    <div className={isLight ? "text-sm font-medium text-blue-500 mb-1" : "text-sm font-medium text-slate-400 mb-1"}>{title}</div>
                    <div className={isLight ? "text-3xl font-bold text-blue-700 drop-shadow-lg" : "text-3xl font-bold text-white drop-shadow-lg"}>{value}</div>
                </div>
            </div>
        </div>
    );
}

function QuickAction({ title, description, icon, color = "cyan", isLight }) {
    // Fix: always provide a valid color key
    const colorMap = {
        cyan: isLight ? "from-blue-100 to-blue-200 border-blue-200 text-blue-500" : "from-cyan-400/20 to-cyan-600/20 border-cyan-400/30 text-cyan-300",
        purple: isLight ? "from-purple-100 to-purple-200 border-purple-200 text-purple-500" : "from-purple-400/20 to-purple-600/20 border-purple-400/30 text-purple-300",
        emerald: isLight ? "from-emerald-100 to-emerald-200 border-emerald-200 text-emerald-500" : "from-emerald-400/20 to-emerald-600/20 border-emerald-400/30 text-emerald-300",
        amber: isLight ? "from-amber-100 to-amber-200 border-amber-200 text-amber-500" : "from-amber-400/20 to-amber-600/20 border-amber-400/30 text-amber-300"
    };
    const colorClasses = colorMap[color] || colorMap['cyan'];
    const textColor = colorClasses.split(' ').find(cls => cls.startsWith('text-')) || (isLight ? 'text-blue-500' : 'text-cyan-300');
    return (
        <div className={
            `group cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ` +
            (isLight ? "bg-white/90 hover:border-blue-300 shadow-blue-200/40" : "bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20")
        }>
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} border mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${icon} text-lg ${textColor}`}></i>
            </div>
            <h3 className={isLight ? "text-lg font-semibold text-blue-700 mb-2" : "text-lg font-semibold text-white mb-2"}>{title}</h3>
            <p className={isLight ? "text-sm text-blue-400" : "text-sm text-slate-400"}>{description}</p>
        </div>
    );
}

function AdminDashboard({ theme }) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const isLight = theme === 'light';

    React.useEffect(() => {
        fetchData().then((result) => {
            setData(result);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className={isLight ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-100 to-white" : "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"}>
                <div className="flex flex-col items-center gap-4">
                    <div className={isLight ? "w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" : "w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"}></div>
                    <span className={isLight ? "text-blue-600 text-xl font-semibold" : "text-cyan-200 text-xl font-semibold"}>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={isLight ? "min-h-screen bg-gradient-to-br from-white via-blue-100 to-white relative overflow-hidden" : "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"}>
            {/* Animated background elements */}
            {isLight ? (
                <>
                    <div className="absolute inset-0 bg-gradient-radial from-blue-200/30 via-transparent to-transparent opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-emerald-200/20 via-transparent to-transparent opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-purple-200/20 via-transparent to-transparent opacity-10"></div>
                </>
            ) : (
                <>
                    <div className="absolute inset-0 bg-gradient-radial from-blue-600/10 via-transparent to-transparent opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-emerald-600/10 via-transparent to-transparent opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent opacity-15"></div>
                </>
            )}

            <div className="relative z-10 flex flex-col gap-8 p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={isLight ? "text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 bg-clip-text text-transparent mb-2" : "text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-2"}>
                            Admin Dashboard
                        </h1>
                        <p className={isLight ? "text-blue-700 text-lg" : "text-slate-400 text-lg"}>Welcome back, manage your learning platform</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={isLight ? "px-4 py-2 rounded-full bg-gradient-to-r from-emerald-200/40 to-emerald-400/20 backdrop-blur-sm border border-emerald-200/60" : "px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/30"}>
                            <span className={isLight ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-emerald-300"}>System Online</span>
                        </div>

                    </div>
                </div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Users" value={data ? data.totalUsers : "..."} icon="fas fa-users" isLight={isLight} />
                    <StatCard title="Active Courses" value={data ? data.totalCourses : "..."} icon="fas fa-graduation-cap" isLight={isLight} />
                    <StatCard title="Categories" value={data ? data.totalCategories : "..."} icon="fas fa-th-list" isLight={isLight} />
                    <StatCard title="Training Sessions" value={data ? data.totalSessions : "..."} icon="fas fa-chart-bar" isLight={isLight} />
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className={isLight ? "text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-3" : "text-2xl font-semibold text-white mb-6 flex items-center gap-3"}>
                        <div className={isLight ? "w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" : "w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"}></div>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <QuickAction
                            title="Add Course"
                            description="Create new learning content"
                            icon="fas fa-plus-circle"
                            color={isLight ? "cyan-light" : "cyan"}
                            isLight={isLight}
                        />
                        <QuickAction
                            title="Manage Users"
                            description="View and edit user profiles"
                            icon="fas fa-users-cog"
                            color={isLight ? "purple-light" : "purple"}
                            isLight={isLight}
                        />
                        <QuickAction
                            title="Analytics"
                            description="View detailed reports"
                            icon="fas fa-chart-line"
                            color={isLight ? "emerald-light" : "emerald"}
                            isLight={isLight}
                        />
                        <QuickAction
                            title="Settings"
                            description="Configure system settings"
                            icon="fas fa-cog"
                            color={isLight ? "amber-light" : "amber"}
                            isLight={isLight}
                        />
                    </div>
                </div>

                {/* Welcome Panel */}
                <div className={isLight ? "mt-8 relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-blue-200/40 shadow-2xl" : "mt-8 relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"}>
                    <div className={isLight ? "absolute inset-0 bg-gradient-to-r from-blue-200/20 to-blue-400/10 opacity-60" : "absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 opacity-50"}></div>
                    <div className="relative p-8">
                        <div className="flex items-start gap-6">
                            <div className={isLight ? "flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-200/40 to-blue-400/30 border border-blue-300 flex items-center justify-center" : "flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center"}>
                                <i className={isLight ? "fas fa-rocket text-2xl text-blue-600" : "fas fa-rocket text-2xl text-cyan-300"}></i>
                            </div>
                            <div className="flex-1">
                                <h2 className={isLight ? "text-2xl font-bold text-blue-700 mb-3" : "text-2xl font-bold text-white mb-3"}>Welcome to the Admin Panel</h2>
                                <p className={isLight ? "text-blue-700 text-lg leading-relaxed mb-6" : "text-slate-300 text-lg leading-relaxed mb-6"}>
                                    Manage your learning platform with confidence. Monitor user engagement,
                                    create compelling courses, and track success metrics with our intuitive dashboard.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <div className={isLight ? "px-4 py-2 rounded-full bg-gradient-to-r from-blue-200/40 to-blue-400/20 border border-blue-200/60" : "px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-cyan-600/20 backdrop-blur-sm border border-cyan-400/30"}>
                                        <span className={isLight ? "text-sm font-medium text-blue-700" : "text-sm font-medium text-cyan-300"}>Latest Updates</span>
                                    </div>
                                    <div className={isLight ? "px-4 py-2 rounded-full bg-gradient-to-r from-purple-200/40 to-purple-400/20 border border-purple-200/60" : "px-4 py-2 rounded-full bg-gradient-to-r from-purple-400/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30"}>
                                        <span className={isLight ? "text-sm font-medium text-purple-700" : "text-sm font-medium text-purple-300"}>New Features</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;