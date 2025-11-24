import React from 'react';
import { Popover as AntdPopover } from 'antd';
import type { PopoverProps as AntdPopoverProps } from 'antd';

const { popoverContent } = require('../style/popover.module.css');

interface PopoverProps extends Omit<AntdPopoverProps, 'content'> {
    children: React.ReactNode;
    content: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({
    children,
    content,
    trigger = 'click',
    ...props
}) => {
    return (
        <AntdPopover
            content={<div className={popoverContent}>{content}</div>}
            trigger={trigger}
            {...props}
        >
            {children}
        </AntdPopover>
    );
};
