import React from 'react';

const TraineeList = ({ registrations }) => (
    <section className="mb-6 bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
            <h2 className="text-2xl font-black mb-6 text-white flex items-center gap-3">
                <i className="fas fa-users text-green-300 text-2xl"></i>
                Registered Trainees
            </h2>
            {registrations.length === 0 ? (
                <div className="text-white/60 italic mb-4 flex items-center gap-2">
                    <i className="fas fa-user-slash text-rose-300"></i>
                    No trainees registered for this session.
                </div>
            ) : (
                <ul className="space-y-2">
                    {registrations.map(reg => (
                        <li key={reg.id} className="flex items-center gap-3 text-white/90 bg-white/5 rounded-lg px-4 py-2">
                            <i className="fas fa-user text-cyan-300"></i>
                            <span className="font-semibold">{reg.user ? reg.user.name || `${reg.user.first_name || ''} ${reg.user.last_name || ''}`.trim() : 'Unknown'}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </section>
);

export default TraineeList;
