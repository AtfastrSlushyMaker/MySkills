// CategoryDetailsModal.js
import React from "react";
import { Modal, Typography, Divider } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function CategoryDetailsModal({ open, category, onClose }) {
    if (!category) return null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={null}
            centered
            className="glass-modal"
            closeIcon={<span className="text-gray-500 text-lg">✕</span>}
        >
            <div className="relative bg-gradient-to-br from-white/60 via-blue-100/40 to-indigo-100/30 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <AppstoreOutlined className="text-white text-2xl" />
                    </div>
                    <Title level={3} className="!mb-0 text-gray-800">{category.name}</Title>
                </div>

                <Divider className="bg-white/40 my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-1">
                            Description
                        </Text>
                        <Text className="text-base text-gray-800">
                            {category.description || 'No description provided'}
                        </Text>
                    </div>

                    <div>
                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-1">
                            Status
                        </Text>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.is_active
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                            {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div>
                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-1">
                            Created At
                        </Text>
                        <Text className="text-base text-gray-800">
                            {category.created_at ? new Date(category.created_at).toLocaleString() : 'N/A'}
                        </Text>
                    </div>

                    <div>
                        <Text className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-1">
                            Last Updated
                        </Text>
                        <Text className="text-base text-gray-800">
                            {category.updated_at ? new Date(category.updated_at).toLocaleString() : 'N/A'}
                        </Text>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default CategoryDetailsModal;