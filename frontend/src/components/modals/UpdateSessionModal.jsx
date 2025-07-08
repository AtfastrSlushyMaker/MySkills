import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { trainingSessionApi, userApi, categoryApi } from '../../services/api'

const UpdateSessionModal = ({ isOpen, onClose, session, onSessionUpdated }) => {
    const [formData, setFormData] = useState({
        category_id: '',
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
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isOpen) {
            fetchTrainers()
            fetchCategories()
            if (session) {
                populateForm(session)
            }
        }
    }, [isOpen, session])

    const populateForm = (sessionData) => {
        // Helper function to format date for input[type="date"]
        const formatDateForInput = (dateString) => {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toISOString().split('T')[0] // Returns yyyy-MM-dd format
        }

        // Helper function to format time for input[type="time"]
        const formatTimeForInput = (timeString) => {
            if (!timeString) return ''
            // If it's a full datetime string, extract just the time part
            if (timeString.includes('T')) {
                const date = new Date(timeString)
                return date.toTimeString().slice(0, 5) // Returns HH:mm format
            }
            // If it's already in HH:mm format, return as is
            return timeString.slice(0, 5)
        }

        setFormData({
            category_id: sessionData.category_id || '',
            trainer_id: sessionData.trainer_id || '',
            date: formatDateForInput(sessionData.date),
            end_date: formatDateForInput(sessionData.end_date),
            start_time: formatTimeForInput(sessionData.start_time),
            end_time: formatTimeForInput(sessionData.end_time),
            location: sessionData.location || '',
            max_participants: sessionData.max_participants || '',
            skill_name: sessionData.skill_name || '',
            skill_description: sessionData.skill_description || ''
        })
    }

    const fetchTrainers = async () => {
        try {
            const response = await userApi.getAllTrainers()
            setTrainers(response.data)
        }
        catch (error) {
            console.error('Error fetching trainers:', error)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getAllCategories()
            setCategories(response.data)
        }
        catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.category_id) newErrors.category_id = 'Category is required'
        if (!formData.trainer_id) newErrors.trainer_id = 'Trainer is required'
        if (!formData.date) newErrors.date = 'Date is required'
        if (!formData.start_time) newErrors.start_time = 'Start time is required'
        if (!formData.end_time) newErrors.end_time = 'End time is required'
        if (!formData.location) newErrors.location = 'Location is required'
        if (!formData.max_participants) newErrors.max_participants = 'Max participants is required'
        if (!formData.skill_name) newErrors.skill_name = 'Skill name is required'

        // Validate time logic
        if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
            newErrors.end_time = 'End time must be after start time'
        }

        // Validate date logic
        if (formData.end_date && formData.date && formData.end_date < formData.date) {
            newErrors.end_date = 'End date must be after start date'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            await trainingSessionApi.updateSession(session.id, formData)
            onSessionUpdated()
            onClose()
            setFormData({
                category_id: '',
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
            setErrors({})
        } catch (error) {
            console.error('Error updating session:', error)
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        onClose()
        setErrors({})
    }

    if (!isOpen) return null

    const modalContent = (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg p-4 overflow-y-auto pt-16">
            <div className="min-h-full flex items-start justify-center py-8">
                <div className="bg-white/30 backdrop-blur-3xl rounded-3xl p-6 border border-white/40 shadow-2xl max-w-2xl w-full relative transform transition-all duration-300 ease-out">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Update Training Session
                            </h2>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-300 border border-white/25 hover:border-white/40"
                            >
                                <i className="fas fa-times text-white text-sm"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Session Details Section */}
                            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                                    Session Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">Skill Name</label>
                                        <input
                                            type="text"
                                            name="skill_name"
                                            placeholder="e.g., Advanced React Development"
                                            value={formData.skill_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all"
                                            required
                                        />
                                        {errors.skill_name && <p className="text-red-400 text-xs mt-1">{errors.skill_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">Trainer</label>
                                        <div className="relative">
                                            <select
                                                name="trainer_id"
                                                value={formData.trainer_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all appearance-none"
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
                                        {errors.trainer_id && <p className="text-red-400 text-xs mt-1">{errors.trainer_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">Category</label>
                                        <div className="relative">
                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all appearance-none"
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
                                        {errors.category_id && <p className="text-red-400 text-xs mt-1">{errors.category_id}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white text-sm font-medium mb-1.5">Description</label>
                                        <textarea
                                            name="skill_description"
                                            placeholder="Describe what participants will learn..."
                                            value={formData.skill_description}
                                            onChange={handleChange}
                                            rows="2"
                                            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all resize-none"
                                        />
                                        {errors.skill_description && <p className="text-red-400 text-xs mt-1">{errors.skill_description}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Section */}
                            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i className="fas fa-calendar text-green-400 mr-2"></i>
                                    Schedule
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">Start Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all"
                                            required
                                        />
                                        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={formData.end_date}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all"
                                        />
                                        {errors.end_date && <p className="text-red-400 text-xs mt-1">{errors.end_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">Start Time</label>
                                        <input
                                            type="time"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all"
                                            required
                                        />
                                        {errors.start_time && <p className="text-red-400 text-xs mt-1">{errors.start_time}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">End Time</label>
                                        <input
                                            type="time"
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all"
                                            required
                                        />
                                        {errors.end_time && <p className="text-red-400 text-xs mt-1">{errors.end_time}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Location & Participants Section */}
                            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i className="fas fa-map-marker-alt text-red-400 mr-2"></i>
                                    Logistics
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">Max Participants</label>
                                        <input
                                            type="number"
                                            name="max_participants"
                                            placeholder="e.g., 25"
                                            value={formData.max_participants}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all"
                                            required
                                        />
                                        {errors.max_participants && <p className="text-red-400 text-xs mt-1">{errors.max_participants}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1.5">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="e.g., Conference Room A, Online, etc."
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all"
                                            required
                                        />
                                        {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/40 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save mr-2"></i>
                                            Update Session
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

    // Render the modal using a portal to escape parent container constraints
    return createPortal(modalContent, document.body)
}

export default UpdateSessionModal
