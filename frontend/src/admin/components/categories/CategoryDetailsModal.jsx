// CategoryDetailsModal.js
import React from "react";
import { Modal, Typography, Divider } from "antd";
import { AppstoreOutlined, CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

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
            width={600}
            className="category-details-modal"
            closeIcon={
                <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 flex items-center justify-center transition-all duration-200">
                    <span className="text-gray-600 text-lg">✕</span>
                </div>
            }
            styles={{
                body: { padding: 0 },
                content: {
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }
            }}
        >
            {/* Header Section */}
            <div className="relative p-6 bg-white border-b border-white/20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/30">
                        <AppstoreOutlined className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                        <Title level={3} className="!mb-1 !text-gray-800 font-semibold">
                            {category.name}
                        </Title>
                        <Text className="text-gray-600 text-sm">
                            Category Details
                        </Text>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                    {category.is_active ? (
                        <CheckCircleOutlined className="text-green-600" />
                    ) : (
                        <CloseCircleOutlined className="text-red-500" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${category.is_active
                        ? 'bg-green-100/70 text-green-800 border border-green-200/50'
                        : 'bg-red-100/70 text-red-800 border border-red-200/50'
                        }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 bg-white">
                <div className="space-y-5">
                    {/* Description */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <Text className="text-xs text-gray-700 uppercase tracking-wider font-medium">
                                Description
                            </Text>
                        </div>
                        <Text className="text-gray-800 text-sm leading-relaxed">
                            {category.description || 'No description provided'}
                        </Text>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarOutlined className="text-blue-600 text-sm" />
                                <Text className="text-xs text-gray-700 uppercase tracking-wider font-medium">
                                    Created At
                                </Text>
                            </div>
                            <Text className="text-gray-800 text-sm font-medium">
                                {category.created_at ? new Date(category.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                }) : 'N/A'}
                            </Text>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarOutlined className="text-purple-600 text-sm" />
                                <Text className="text-xs text-gray-700 uppercase tracking-wider font-medium">
                                    Last Updated
                                </Text>
                            </div>
                            <Text className="text-gray-800 text-sm font-medium">
                                {category.updated_at ? new Date(category.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                }) : 'N/A'}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default CategoryDetailsModal;