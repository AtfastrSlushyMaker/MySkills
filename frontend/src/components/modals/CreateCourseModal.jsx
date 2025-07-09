import { useState } from 'react'
import { trainingCourseApi } from '../../services/api'

const CreateCourseModal = ({ isOpen, onClose, session, onCourseCreated }) => {
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        duration_hours: '',
        is_active: true,
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setCourseData({
            ...courseData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        try {
            const dataToSubmit = {
                ...courseData,
                training_session_id: session.id,
                created_by: session.trainer_id, // or use current user if needed
            }
            const response = await trainingCourseApi.createCourse(dataToSubmit)
            onCourseCreated(response.data)
            setSuccessMessage('Course created successfully!')
            setTimeout(() => {
                setSuccessMessage('')
                onClose()
            }, 2000)
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors || {})
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
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                                Create Course
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-300 border border-white/25 hover:border-white/40"
                            >
                                <i className="fas fa-times text-white text-sm"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25">
                                <div className="mb-3">
                                    <label className="block text-white/90 text-sm font-medium mb-1.5">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Course Title"
                                        value={courseData.title}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                        required
                                    />
                                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title[0]}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block text-white/90 text-sm font-medium mb-1.5">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Course Description"
                                        value={courseData.description}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all resize-none"
                                    />
                                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description[0]}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block text-white/90 text-sm font-medium mb-1.5">Duration (hours)</label>
                                    <input
                                        type="number"
                                        name="duration_hours"
                                        placeholder="e.g., 8"
                                        value={courseData.duration_hours}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-3 py-2.5 bg-white/15 border border-white/25 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                        required
                                    />
                                    {errors.duration_hours && <p className="text-red-400 text-xs mt-1">{errors.duration_hours[0]}</p>}
                                </div>
                            </div>
                            {successMessage && (
                                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-green-300 text-center text-sm">
                                    <i className="fas fa-check-circle mr-2"></i>
                                    {successMessage}
                                </div>
                            )}
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
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-plus mr-2"></i>
                                            Create Course
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

export default CreateCourseModal
