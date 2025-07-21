

import React from 'react';
import { Modal, Rate, Tag, Descriptions, Divider, Tooltip } from 'antd';
import { UserOutlined, CalendarOutlined, StarFilled, BookOutlined, MailOutlined, IdcardOutlined, EnvironmentOutlined, CheckCircleTwoTone, CloseCircleTwoTone, MessageOutlined } from '@ant-design/icons';

function FeedbackDetailsModal({ visible, feedback, onCancel }) {
    // Extract user, session, and date from nested structure
    const user = feedback?.registration?.user || feedback?.user || {};
    const userName = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Unknown';
    const userEmail = user.email || '-';
    const userRole = user.role || '-';
    const userStatus = user.status || '-';

    const session = feedback?.registration?.training_session || feedback?.training_session || {};
    const sessionName = session.skill_name || '-';
    const sessionDate = session.date ? new Date(session.date).toLocaleDateString() : '-';
    const sessionLocation = session.location || '-';

    const registration = feedback?.registration || {};
    const registrationStatus = registration.status || '-';

    const date = feedback?.created_at || registration.created_at || '';

    return (
        <Modal
            open={visible}
            title={<span className="font-bold text-lg text-blue-700">Feedback Details</span>}
            onCancel={onCancel}
            footer={null}
            className="rounded-xl shadow-lg backdrop-blur-md"
        >
            <Descriptions
                bordered
                column={1}
                size="middle"
                className="bg-white/30 rounded-lg p-2"
                labelStyle={{ fontWeight: 600, color: '#2563eb', background: 'rgba(59,130,246,0.07)' }}
                contentStyle={{ background: 'rgba(255,255,255,0.7)' }}
            >
                <Descriptions.Item label={<span><UserOutlined /> User</span>}>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-800">{userName}</span>
                        <span className="flex items-center gap-1 text-gray-500 text-sm"><MailOutlined /> {userEmail}</span>
                        <span className="flex items-center gap-1 text-gray-500 text-sm"><IdcardOutlined /> {userRole}</span>
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                            {userStatus === 'active' ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#f5222d" />} {userStatus}
                        </span>
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label={<span><BookOutlined /> Session</span>}>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-indigo-700">{sessionName}</span>
                        <span className="flex items-center gap-1 text-gray-500 text-sm"><CalendarOutlined /> {sessionDate}</span>
                        <span className="flex items-center gap-1 text-gray-500 text-sm"><EnvironmentOutlined /> {sessionLocation}</span>
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label={<span><Tag color={registrationStatus === 'confirmed' ? 'green' : 'orange'}>{registrationStatus}</Tag> Registration</span>}>
                    <span className="text-gray-700">{registrationStatus}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span><StarFilled className="text-yellow-400" /> Rating</span>}>
                    <div className="flex items-center gap-2">
                        <Rate value={feedback?.rating} disabled className="text-blue-500" />
                        {feedback?.rating && (
                            <span className="text-blue-600 font-semibold">{feedback.rating} / 5</span>
                        )}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label={<span><MessageOutlined /> Comment</span>}>
                    <div className="text-gray-900 bg-white/40 rounded-lg p-3 min-h-[48px]">
                        {feedback?.comment || <span className="italic text-gray-400">No comment provided.</span>}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label={<span><CalendarOutlined /> Submitted</span>}>
                    <span className="text-gray-500">{date ? new Date(date).toLocaleString() : '-'}</span>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}

export default FeedbackDetailsModal;
