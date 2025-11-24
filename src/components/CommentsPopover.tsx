import React from 'react';
import { Space } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { Popover } from './Popover';

interface CommentsPopoverProps {
    postTitle: string;
    commentCount?: number;
}

export const CommentsPopover: React.FC<CommentsPopoverProps> = ({
    postTitle,
    commentCount = 0,
}) => {
    const content = (
        <div>
            <div style={{ marginBottom: '0.5rem' }}>
                <strong>Comments</strong>
            </div>
            <p>Comments for "{postTitle}"</p>
            <p style={{ color: '#888', fontStyle: 'italic', marginBottom: 0 }}>
                Comment functionality coming soon...
            </p>
        </div>
    );

    return (
        <Popover content={content}>
            <Space style={{ cursor: 'pointer' }}>
                <MessageOutlined />
                {commentCount}
            </Space>
        </Popover>
    );
};
