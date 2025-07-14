import React, { useState } from 'react';

const FeedbackForm = ({ sessionId, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit({ rating, comment });
        setRating(0);
        setComment('');
    };

    return (
        <div className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-8 border border-white/30 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-2">
                    <label className="block text-white/90 font-semibold flex items-center gap-3">
                        <i className="fas fa-star text-yellow-400 drop-shadow"></i>
                        <span className="text-lg">Rating:</span>
                        <span className="flex items-center ml-2 gap-1">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`fas fa-star cursor-pointer text-3xl transition-all duration-150 ${i < (hoverRating || rating) ? 'text-yellow-400 drop-shadow-lg scale-110' : 'text-gray-600/40'}`}
                                    style={{ filter: i < (hoverRating || rating) ? 'drop-shadow(0 0 6px #facc15)' : 'none' }}
                                    onMouseEnter={() => setHoverRating(i + 1)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(i + 1)}
                                ></i>
                            ))}
                        </span>
                    </label>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-white/90 font-semibold flex items-center gap-3">
                        <i className="fas fa-comment-dots text-blue-300"></i>
                        <span className="text-lg">Comment:</span>
                    </label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} className="border-2 border-blue-400/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 rounded-xl px-3 py-2 w-full bg-white/20 text-white placeholder:text-white/60 transition-all duration-150 shadow-inner" required placeholder="Write your feedback..." rows={3} />
                </div>
                <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-2 rounded-xl font-bold shadow-xl transition-all flex items-center gap-2 text-lg">
                    <i className="fas fa-paper-plane"></i> Submit
                </button>
            </form>
        </div>
    );
}

export default FeedbackForm;
