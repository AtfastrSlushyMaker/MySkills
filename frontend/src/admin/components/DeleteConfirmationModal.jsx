import React from "react";
import { Modal, Button } from "antd";

function DeleteConfirmationModal({ visible, loading, onConfirm, onCancel, itemName = "this item", message }) {
    return (
        <Modal
            open={visible}
            title="Confirm Deletion"
            onOk={onConfirm}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
        >
            <p>{message || `Are you sure you want to delete ${itemName}? This action cannot be undone.`}</p>
        </Modal>
    );
}

export default DeleteConfirmationModal;
