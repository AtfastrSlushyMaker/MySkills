import React from 'react';

const DeleteCourseContentModal = ({ open, onClose, onConfirm }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-red-600">Delete Course Content</h2>
                <p className="mb-6 text-gray-700">Are you sure you want to delete this course content? This action cannot be undone.</p>
                <div className="flex gap-2 justify-end">
                    <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onConfirm}>Delete</button>
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCourseContentModal;
