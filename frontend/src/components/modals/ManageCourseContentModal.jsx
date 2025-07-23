import React from 'react';

const ManageCourseContentModal = ({ open, onClose, onEdit, onDelete, content }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Manage Course Content</h2>
                <div className="mb-4">
                    <div className="font-medium">Type: {content?.type}</div>
                    <div className="mt-2 text-gray-700">{content?.content}</div>
                </div>
                <div className="flex gap-2 justify-end">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={onEdit}>Edit</button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onDelete}>Delete</button>
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ManageCourseContentModal;
