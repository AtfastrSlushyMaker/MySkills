import React, { useState, useEffect } from 'react';
import GlassmorphismBackground from '../components/GlassmorphismBackground';
import { Link } from 'react-router-dom';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.filter(category => category.is_active));
            setError(null);
        } catch (err) {
            setError(err.message);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'Software Development': 'fa-code',
            'Data Science & Analytics': 'fa-chart-bar',
            'Cloud Computing': 'fa-cloud',
            'Digital Marketing': 'fa-bullhorn',
            'Project Management': 'fa-tasks',
            'Cybersecurity': 'fa-shield-alt',
            'Artificial Intelligence': 'fa-brain',
            'Mobile Development': 'fa-mobile-alt',
            'Web Design & UX': 'fa-palette',
            'Business Analytics': 'fa-chart-line',
            'DevOps & Infrastructure': 'fa-cogs',
            'Database Management': 'fa-database',
        };
        return iconMap[categoryName] || 'fa-code';
    };

    const getCategoryGradient = (index) => {
        const gradients = [
            'from-cyan-500 to-blue-600',
            'from-purple-500 to-pink-600',
            'from-emerald-500 to-cyan-600',
            'from-orange-500 to-red-600',
            'from-indigo-500 to-purple-600',
            'from-blue-500 to-indigo-600',
            'from-green-500 to-teal-600',
            'from-pink-500 to-red-600',
            'from-yellow-500 to-orange-600',
            'from-violet-500 to-purple-600',
            'from-teal-500 to-green-600',
            'from-red-500 to-pink-600',
        ];
        return gradients[index % gradients.length];
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-900/40 via-purple-900/40 to-pink-900/40">
            <GlassmorphismBackground />
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-x">
                        Explore All Categories
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Browse our diverse learning categories and find your next skill to master.
                    </p>
                </div>
                <div className="flex justify-center mb-12">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full max-w-lg px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 focus:bg-white/20 text-lg shadow-xl backdrop-blur-xl transition-all"
                    />
                </div>
                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 backdrop-blur-xl rounded-xl border border-red-500/30 text-red-200 max-w-md mx-auto text-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Unable to load categories.
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 animate-pulse h-80"></div>
                        ))
                    ) : filteredCategories.length === 0 ? (
                        <div className="col-span-full text-center text-white/70 text-xl py-24">
                            <i className="fas fa-search-minus text-3xl mb-4"></i>
                            <div>No categories found.</div>
                        </div>
                    ) : (
                        filteredCategories.map((category, index) => {
                            const gradient = getCategoryGradient(index);
                            const icon = getCategoryIcon(category.name);
                            return (
                                <Link key={category.id} to={`/categories/${category.id}`} className="group relative block h-full">
                                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl pointer-events-none" style={{ background: `linear-gradient(135deg, ${gradient.replace('from-', '').replace(' to-', ', ')})` }}></div>
                                    <div className={`relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:scale-105 shadow-xl h-80 flex flex-col`}>
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                            <i className={`fas ${icon} text-2xl text-white`}></i>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-4">{category.name}</h3>
                                        <p className="text-white/70 leading-relaxed text-sm flex-grow">{category.description}</p>
                                        <span className="mt-6 w-full py-3 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold transition-all duration-300 text-base flex items-center justify-center gap-2 shadow-none pointer-events-none">
                                            <i className="fas fa-arrow-right text-cyan-400 group-hover:text-pink-400 transition-colors duration-300"></i>
                                            <span>View Sessions</span>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoriesPage;
