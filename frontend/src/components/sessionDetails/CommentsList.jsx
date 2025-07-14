
import React from 'react';


const CommentsList = ({ feedbacks, children, loading, error }) => (
    <section className="mb-6 bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
            <h2 className="text-2xl font-black mb-6 text-white flex items-center gap-3">
                <i className="fas fa-comments text-pink-300 text-2xl"></i>
                Comments & Ratings
            </h2>
            {children}
            {loading ? (
                <div className="text-white/60 italic mb-4 flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin text-cyan-300"></i>
                    Loading feedback...
                </div>
            ) : error ? (
                <div className="text-red-400 italic mb-4 flex items-center gap-2">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            ) : (!Array.isArray(feedbacks) || feedbacks.length === 0) ? (
                <div className="text-white/60 italic mb-4 flex items-center gap-2">
                    <i className="fas fa-comment-slash text-rose-300"></i>
                    No feedback yet.
                </div>
            ) : (
                <ul className="space-y-4">
                    {feedbacks.map(fb => (
                        <li key={fb.id} className="bg-white/5 rounded-lg px-4 py-3 text-white/90 shadow flex flex-col gap-1">
                            <div className="flex items-center gap-2 font-semibold">
                                <i className="fas fa-user-circle text-cyan-300"></i>
                                {fb.user ? (fb.user.first_name ? fb.user.first_name + ' ' + fb.user.last_name : 'Unknown') : 'Unknown'}
                            </div>
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star ${i < fb.rating ? 'text-yellow-300' : 'text-gray-500/40'}`}></i>
                                ))}
                                <span className="ml-2">{fb.rating} / 5</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="fas fa-comment-dots text-blue-300 mt-1"></i>
                                <span
                                    style={{
                                        wordBreak: 'break-word',
                                        maxHeight: '6em',
                                        overflowY: 'auto',
                                        display: 'block',
                                        whiteSpace: 'pre-line',
                                    }}
                                    className="w-full pr-2"
                                >
                                    <span className="font-bold text-white/70">Comment:</span> {fb.comment}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </section>
);

export default CommentsList;
