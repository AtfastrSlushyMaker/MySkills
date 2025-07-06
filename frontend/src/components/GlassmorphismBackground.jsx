function GlassmorphismBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {/* Enhanced floating orbs with more sophisticated animations */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse animated-orb"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse animated-orb" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse animated-orb" style={{ animationDelay: '4s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse animated-orb" style={{ animationDelay: '6s' }}></div>
                <div className="absolute bottom-40 right-1/4 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl animate-pulse animated-orb" style={{ animationDelay: '8s' }}></div>

                {/* Mesh gradient overlay with animation */}
                <div className="absolute inset-0 mesh-gradient opacity-30"></div>

                {/* Dynamic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15"></div>

                {/* Enhanced noise texture overlay */}
                <div className="absolute inset-0 opacity-10 bg-repeat animate-pulse" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '256px 256px',
                    animationDuration: '20s'
                }}></div>

                {/* Additional decorative elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }}></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-green-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '3s' }}></div>
            </div>
        </div>
    )
}

export default GlassmorphismBackground
