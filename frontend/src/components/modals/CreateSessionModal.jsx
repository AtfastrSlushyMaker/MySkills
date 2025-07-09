import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { trainingSessionApi } from '../../services/api'
import { categoryApi } from '../../services/api'
import { userApi } from '../../services/api'



const CreateSessionModal = ({ isOpen, onClose, onSessionCreated }) => {

    const { user } = useAuth()
    const [sessionData, setSessionData] = useState({
        category_id: '',
        coordinator_id: user.id,
        trainer_id: '',
        date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        location: '',
        max_participants: '',
        skill_name: '',
        skill_description: ''
    })
    const [trainers, setTrainers] = useState([])
    const [categories, setCategories] = useState([])
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const fetchTrainers = async () => {
        try {
            const res = await userApi.getTrainers()
            setTrainers(res.data)
        } catch (error) {
            // Removed debug log
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await categoryApi.getCategories()
            setCategories(res.data)
        } catch (error) {
            // Removed debug log
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchTrainers()
            fetchCategories()
        }
    }, [isOpen])
    const handleChange = (e) => {
        const { name, value } = e.target
        setSessionData({
            ...sessionData,
            [name]: value
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            // Ensure coordinator_id is set to current user
            const dataToSubmit = {
                ...sessionData,
                coordinator_id: user?.id
            }

            const response = await trainingSessionApi.createSession(dataToSubmit)
            onSessionCreated(response.data)
            setSuccessMessage('Training session created successfully!')

            // Reset form after successful creation
            setTimeout(() => {
                setSuccessMessage('')
                onClose()
            }, 2000)
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors)
            } else {
                setErrors({ general: 'An unexpected error occurred. Please try again.' })
            }
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg p-4 overflow-y-auto pt-24">
            <div className="min-h-full flex items-center justify-center py-4">
                <div className="bg-white/25 backdrop-blur-3xl rounded-3xl p-6 border border-white/30 shadow-2xl max-w-lg w-full relative transform transition-all duration-300 ease-out">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Create Training Session
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-300 border border-white/25 hover:border-white/40"
                            >
                                <i className="fas fa-times text-white text-sm"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Session Details Section */}
                            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                                    Session Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Skill Name</label>
                                        <input
                                            type="text"
                                            name="skill_name"
                                            placeholder="e.g., React Advanced"
                                            value={sessionData.skill_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                            required
                                        />
                                        {errors.skill_name && <p className="text-red-400 text-xs mt-1">{errors.skill_name[0]}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Category</label>
                                        <div className="relative">
                                            <select
                                                name="category_id"
                                                value={sessionData.category_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all appearance-none cursor-pointer pr-10"
                                                required
                                            >
                                                <option value="" className="bg-gray-800 text-white">Select Category</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <i className="fas fa-chevron-down text-white/60 text-sm"></i>
                                            </div>
                                        </div>
                                        {errors.category_id && <p className="text-red-400 text-xs mt-1">{errors.category_id[0]}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Description</label>
                                        <textarea
                                            name="skill_description"
                                            placeholder="Describe what participants will learn..."
                                            value={sessionData.skill_description}
                                            onChange={handleChange}
                                            rows="2"
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all resize-none"
                                        />
                                        {errors.skill_description && <p className="text-red-400 text-xs mt-1">{errors.skill_description[0]}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Section */}
                            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i className="fas fa-calendar text-green-400 mr-2"></i>
                                    Schedule
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Start Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={sessionData.date}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                            required
                                        />
                                        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date[0]}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={sessionData.end_date}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                            required
                                        />
                                        {errors.end_date && <p className="text-red-400 text-xs mt-1">{errors.end_date[0]}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Start Time</label>
                                        <input
                                            type="time"
                                            name="start_time"
                                            value={sessionData.start_time}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                            required
                                        />
                                        {errors.start_time && <p className="text-red-400 text-xs mt-1">{errors.start_time[0]}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">End Time</label>
                                        <input
                                            type="time"
                                            name="end_time"
                                            value={sessionData.end_time}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                            required
                                        />
                                        {errors.end_time && <p className="text-red-400 text-xs mt-1">{errors.end_time[0]}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Logistics Section */}
                            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i className="fas fa-cogs text-yellow-400 mr-2"></i>
                                    Logistics
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Trainer</label>
                                        <div className="relative">
                                            <select
                                                name="trainer_id"
                                                value={sessionData.trainer_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all appearance-none cursor-pointer pr-10"
                                                required
                                            >
                                                <option value="" className="bg-gray-800 text-white">Select Trainer</option>
                                                {trainers.map(trainer => (
                                                    <option key={trainer.id} value={trainer.id} className="bg-gray-800 text-white">
                                                        {trainer.first_name} {trainer.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <i className="fas fa-chevron-down text-white/60 text-sm"></i>
                                            </div>
                                        </div>
                                        {errors.trainer_id && <p className="text-red-400 text-xs mt-1">{errors.trainer_id[0]}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Max Participants</label>
                                        <input
                                            type="number"
                                            name="max_participants"
                                            placeholder="e.g., 20"
                                            value={sessionData.max_participants}
                                            onChange={handleChange}
                                            min="1"
                                            max="100"
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                            required
                                        />
                                        {errors.max_participants && <p className="text-red-400 text-xs mt-1">{errors.max_participants[0]}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white/90 text-sm font-medium mb-1.5">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="e.g., Conference Room A, Online, etc."
                                            value={sessionData.location}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                            required
                                        />
                                        {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location[0]}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Success Message */}
                            {successMessage && (
                                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-green-300 text-center text-sm">
                                    <i className="fas fa-check-circle mr-2"></i>
                                    {successMessage}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-plus mr-2"></i>
                                            Create Session
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CreateSessionModal