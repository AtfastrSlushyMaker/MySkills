function LoadingSpinner({ size = 'md', color = 'white' }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    }

    const colorClasses = {
        white: 'text-white',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        pink: 'text-pink-400',
        gray: 'text-gray-400'
    }

    return (
        <div className={`relative ${sizeClasses[size]}`}>
            {/* Glassmorphism background circle */}
            <div className={`absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg ${sizeClasses[size]}`}></div>

            {/* Spinning loader with glassmorphism */}
            <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} drop-shadow-lg relative z-10`}>
                <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* Outer spinning circle with gradient */}
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="url(#gradient1)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="30 10"
                        className="opacity-90"
                    />
                    {/* Inner glow circle */}
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                        className="opacity-30"
                    />
                    {/* SVG gradient definitions */}
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                            <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Pulsing glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-sm animate-pulse ${sizeClasses[size]} pointer-events-none`} style={{ animationDuration: '2s' }}></div>
        </div>
    )
}

export default LoadingSpinner
