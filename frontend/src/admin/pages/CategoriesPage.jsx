import React, { useState, useEffect } from "react";
import CategoryCreateModal from "../components/categories/CategoryCreateModal";
import CategoryUpdateModal from "../components/categories/CategoryUpdateModal";
import CategoryDetailsModal from "../components/categories/CategoryDetailsModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { Table, Button, Input, Space, Tag, Card, Badge, Typography, message, Avatar } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, AppstoreOutlined, CheckCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { categoryApi } from '../../services/api';

const { Title, Text } = Typography;

function CategoriesPage() {
    // Data from API
    const [data, setData] = useState([]);
    // Pagination state for Table
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    // Fetch categories from API
    useEffect(() => {
        setLoading(true);
        categoryApi.getAllCategories()
            .then(res => {
                // If API returns array directly
                const categories = Array.isArray(res.data) ? res.data : res.data.data || [];
                // Add key property for Table
                setData(categories.map(cat => ({ ...cat, key: cat.id })));
            })
            .catch(() => {
                message.error('Failed to fetch categories');
            })
            .finally(() => setLoading(false));
    }, []);

    const [categoryStats, setCategoryStats] = useState({
        total_categories: 12,
        active_categories: 10,
        archived_categories: 2
    });

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [categoryToView, setCategoryToView] = useState(null);

    // Calculate stats from data
    useEffect(() => {
        const activeCount = data.filter(cat => cat.is_active === true).length;
        const inactiveCount = data.filter(cat => cat.is_active === false).length;
        setCategoryStats({
            total_categories: data.length,
            active_categories: activeCount,
            archived_categories: inactiveCount
        });
    }, [data]);

    const getStatusColor = (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-red-100 text-red-800 border-red-200';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        setModalLoading(true);
        try {
            await categoryApi.deleteCategory(categoryToDelete.id);
            setData(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
            message.success("Category deleted successfully");
        } catch (error) {
            message.error("Failed to delete category");
        }
        setModalLoading(false);
        setDeleteModalVisible(false);
        setCategoryToDelete(null);
    };

    const columns = [
        {
            title: 'Category',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        icon={<AppstoreOutlined />}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate">
                            {record.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{record.description}</div>
                        <div className="text-sm text-blue-600 font-medium">{Array.isArray(record.training_sessions) ? record.training_sessions.length : 0} sessions</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => {
                const dotColor = isActive ? 'bg-green-500' : 'bg-red-500';
                const statusText = isActive ? 'Active' : 'Inactive';
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(isActive)}`}>
                            {statusText}
                        </span>
                    </div>
                );
            },
        },
        {
            title: 'Sessions',
            dataIndex: 'training_sessions',
            key: 'training_sessions',
            render: (sessions, record) => {
                const count = Array.isArray(record.training_sessions) ? record.training_sessions.length : 0;
                return (
                    <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{count}</div>
                        <div className="text-xs text-gray-500">sessions</div>
                    </div>
                );
            },
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (
                <Text className="text-sm text-gray-600">{formatDate(text)}</Text>
            ),
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => (
                <Text className="text-sm text-gray-600">{formatDate(text)}</Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        className="hover:bg-blue-50 hover:text-blue-600 border-0 text-gray-600"
                        size="small"
                        onClick={() => { setCategoryToView(record); setDetailsModalVisible(true); }}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="hover:bg-green-50 hover:text-green-600 border-0 text-gray-600"
                        size="small"
                        onClick={() => { setSelectedCategory(record); setUpdateModalVisible(true); }}
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        className="hover:bg-red-50 hover:text-red-600 border-0 text-gray-600"
                        size="small"
                        onClick={() => { setCategoryToDelete(record); setDeleteModalVisible(true); }}
                    />
                </Space>
            ),
        },
    ];

    const filteredData = data.filter(category => {
        const name = category.name ? category.name.toLowerCase() : "";
        const description = category.description ? category.description.toLowerCase() : "";
        const statusText = category.is_active ? "active" : "inactive";
        const searchTerm = search.toLowerCase();
        return name.includes(searchTerm) || description.includes(searchTerm) || statusText.includes(searchTerm);
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
            {/* Background overlay for glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-blue-100/30 to-indigo-100/20 backdrop-blur-sm"></div>
            <div className="max-w-7xl mx-auto p-6 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Title level={1} className="!text-gray-900 !mb-2">
                                Categories Management
                            </Title>
                            <Text className="text-gray-600 text-base">
                                Manage your course categories and organize your content
                            </Text>
                        </div>
                        <Badge count={data.length} showZero color="#3b82f6" className="mr-4">
                            <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-white/20">
                                <Text className="text-sm font-medium text-gray-700">Total Categories</Text>
                            </div>
                        </Badge>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex flex-wrap justify-center items-stretch gap-6 mb-8">
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <AppstoreOutlined className="text-blue-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Total Categories</Text>
                                <div className="text-2xl font-bold text-gray-900">{categoryStats.total_categories}</div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <CheckCircleOutlined className="text-green-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Active</Text>
                                <div className="text-2xl font-bold text-gray-900">{categoryStats.active_categories}</div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className="flex-1 max-w-[220px] min-w-[180px] border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-center items-stretch transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl hover:bg-white/40"
                        styles={{ body: { padding: '20px 24px' } }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <InboxOutlined className="text-gray-600 text-2xl" />
                            </div>
                            <div>
                                <Text className="text-sm text-gray-600">Archived</Text>
                                <div className="text-2xl font-bold text-gray-900">{categoryStats.archived_categories}</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="border-0 shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <Input
                            placeholder="Search categories by name, description, or status..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="sm:max-w-sm bg-white/30 backdrop-blur-sm border-white/30"
                            size="large"
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 border-0 shadow-lg backdrop-blur-sm"
                            onClick={() => setCreateModalVisible(true)}
                        >
                            Add Category
                        </Button>
                    </div>

                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        loading={loading}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`,
                            onChange: (page, pageSize) => setPagination({ current: page, pageSize })
                        }}
                        className="overflow-hidden bg-white/30 backdrop-blur-sm !mt-6"
                        rowClassName="hover:bg-white/20 transition-colors duration-200"
                        scroll={{ x: 800 }}
                    />
                </Card>
            </div>

            {/* Category Modals */}
            <CategoryCreateModal
                visible={createModalVisible}
                onCreate={(values) => {
                    setModalLoading(true);
                    categoryApi.createCategory(values)
                        .then(res => {
                            const newCategory = res.data;
                            setData(prev => [{ ...newCategory, key: newCategory.id }, ...prev]);
                            setCreateModalVisible(false);
                            message.success("Category created successfully");
                        })
                        .catch(() => message.error("Failed to create category"))
                        .finally(() => setModalLoading(false));
                }}
                onCancel={() => setCreateModalVisible(false)}
                loading={modalLoading}
            />
            <CategoryUpdateModal
                visible={updateModalVisible}
                category={selectedCategory}
                onUpdate={(updated) => {
                    setModalLoading(true);
                    categoryApi.updateCategory(updated.id, updated)
                        .then(res => {
                            const updatedCategory = res.data;
                            setData(prev => prev.map(cat => cat.id === updatedCategory.id ? { ...updatedCategory, key: updatedCategory.id } : cat));
                            setUpdateModalVisible(false);
                            message.success("Category updated successfully");
                        })
                        .catch(() => message.error("Failed to update category"))
                        .finally(() => setModalLoading(false));
                }}
                onCancel={() => setUpdateModalVisible(false)}
                loading={modalLoading}
            />
            <CategoryDetailsModal
                open={detailsModalVisible}
                category={categoryToView}
                onClose={() => { setDetailsModalVisible(false); setCategoryToView(null); }}
            />
            <DeleteConfirmationModal
                visible={deleteModalVisible}
                loading={modalLoading}
                onConfirm={handleDeleteCategory}
                onCancel={() => setDeleteModalVisible(false)}
                itemName={categoryToDelete?.name || "this category"}
                message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
            />
            <style>{`
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default CategoriesPage;