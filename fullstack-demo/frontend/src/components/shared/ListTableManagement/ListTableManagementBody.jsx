'use client'

import React from 'react';
import { Table, Space, Button, Switch } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ListTableManagementBody = ({
    tableTitle,
    tableData,
    headers,
    buttons = [],
    handleItemDelete,
    handleItemUpdate,
}) => {
    // calculate dynamic width for actions column
    const actionCount = buttons.length + (handleItemUpdate ? 1 : 0) + (handleItemDelete ? 1 : 0);
    const actionWidth = actionCount * 80; // adjust per-button width as needed

    const columns = [
        // dynamic columns from headers
        ...headers.map(({ property, title, onClick, toggleIcon }) => ({
            title,
            dataIndex: property,
            key: property,
            render: (value, record) => {
                // nested property resolution
                const cell = property.split('.').reduce((o, k) => o?.[k], record);
                if (toggleIcon) {
                    return (
                        <Switch
                            checked={!!cell}
                            onClick={onClick ? () => onClick(record) : undefined}
                        />
                    );
                }
                return (
                    <span
                        onClick={onClick ? () => onClick(record) : undefined}
                        className={onClick ? 'cursor-pointer hover:underline' : ''}
                    >
                        {String(cell ?? '').charAt(0).toUpperCase() + String(cell ?? '').slice(1)}
                    </span>
                );
            },
        })),
        // action column
        {
            title: 'Actions',
            key: 'actions',
            width: actionWidth,
            render: (_, record) => (
                <Space>
                    {buttons.map(({ title, onClick, condition }) =>
                        (condition?.(record) ?? true) && (
                            <Button
                                key={title}
                                type="primary"
                                size="small"
                                onClick={() => onClick(record)}
                            >
                                {title}
                            </Button>
                        )
                    )}
                    {handleItemUpdate && (
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleItemUpdate(record)}
                        />
                    )}
                    {handleItemDelete && (
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => handleItemDelete(record)}
                        />
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 capitalize">
                {tableTitle.replace('_', ' ')}
            </h2>
            <Table
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                pagination={false}
                bordered
                size="middle"
            />
        </div>
    );
};

export default ListTableManagementBody;