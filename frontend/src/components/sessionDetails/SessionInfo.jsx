import React from 'react';

const SessionInfo = ({ session }) => (
    <section className="mb-6 bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute left-0 top-0 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6 text-white flex items-center gap-3">
                <i className="fas fa-info-circle text-cyan-300 text-2xl"></i>
                Session Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 text-white/90 text-lg">
                <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-lightbulb text-yellow-300"></i>
                    <span className="font-semibold">Skill:</span>
                    <span>{session.skill_name}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-align-left text-pink-300"></i>
                    <span className="font-semibold">Description:</span>
                    <span>{session.skill_description}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-calendar-alt text-cyan-300"></i>
                    <span className="font-semibold">Date:</span>
                    <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-clock text-purple-300"></i>
                    <span className="font-semibold">Time:</span>
                    <span>{session.start_time} - {session.end_time}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-map-marker-alt text-green-300"></i>
                    <span className="font-semibold">Location:</span>
                    <span>{session.location}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-user-tie text-blue-300"></i>
                    <span className="font-semibold">Trainer:</span>
                    <span>{session.trainer?.name || session.trainer?.first_name + ' ' + session.trainer?.last_name}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-user-cog text-indigo-300"></i>
                    <span className="font-semibold">Coordinator:</span>
                    <span>{session.coordinator?.name || session.coordinator?.first_name + ' ' + session.coordinator?.last_name}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-check-circle text-emerald-300"></i>
                    <span className="font-semibold">Status:</span>
                    <span className="capitalize">{session.status}</span>
                </div>
            </div>
        </div>
    </section>
);

export default SessionInfo;
