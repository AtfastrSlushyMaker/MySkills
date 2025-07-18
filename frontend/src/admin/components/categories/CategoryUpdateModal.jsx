// CategoryUpdateModal.js
import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Switch } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

function CategoryUpdateModal({ visible, category, onUpdate, onCancel, loading }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && category) {
            form.setFieldsValue({ ...category });
        }
    }, [visible, category]);

    const handleCancel = () => {
        onCancel();
    };

    const handleOk = (values) => {
        onUpdate({ ...category, ...values });
    };

    return (
        <Modal
            open={visible}
            onCancel={handleCancel}
            afterClose={() => form.resetFields()}
            footer={null}
            centered
            className="glass-modal"
            title={
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <AppstoreOutlined className="text-blue-600" />
                    <span>Update Category</span>
                </div>
            }
        >
            <div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleOk}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        label={<span className="font-bold text-gray-700">Category Name</span>}
                        rules={[{ required: true, message: "Please enter the category name" }]}
                    >
                        <Input
                            prefix={<AppstoreOutlined className="text-gray-400" />}
                            placeholder="Category Name"
                            size="large"
                            className="rounded-xl border border-gray-200 bg-white/80"
                            autoFocus
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={<span className="font-bold text-gray-700">Description</span>}
                    >
                        <Input.TextArea
                            placeholder="Description"
                            rows={3}
                            className="rounded-xl border border-gray-200 bg-white/80"
                        />
                    </Form.Item>
                    <Form.Item
                        name="is_active"
                        label={<span className="font-bold text-gray-700">Status</span>}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            defaultChecked={category?.is_active}
                            className="bg-gray-300"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Update Category
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default CategoryUpdateModal;