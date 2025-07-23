import React, { useState } from 'react';

const EditCourseContentModal = ({ open, onClose, content, onSave }) => {
    const [type, setType] = useState(content?.type || 'text');
    const [value, setValue] = useState(content?.content || '');

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Course Content</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Type</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded">
                        <option value="text">Text</option>
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                        <option value="file">File</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Content</label>
                    <input value={value} onChange={e => setValue(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div className="flex gap-2 justify-end">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onSave({ type, content: value ?? '' })}>Save</button>
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditCourseContentModal;
