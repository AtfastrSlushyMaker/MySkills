import React from "react";

function CategoriesPage() {
    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-[#181f2a] to-[#0d1117] backdrop-blur-xl">
            <h1 className="text-2xl font-bold text-cyan-200 mb-6 drop-shadow-lg">Categories</h1>
            <div className="rounded-2xl bg-gradient-to-br from-cyan-900/40 to-cyan-700/20 shadow-lg p-8 border border-cyan-400/10 backdrop-blur-lg">
                <p className="text-gray-300">Category management features will appear here. Add, edit, and view categories in a clean, glassy interface.</p>
            </div>
        </div>
    );
}

export default CategoriesPage;
