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
    const actionCount = buttons.length + (handleItemUpdate ? 1 : 0) + (handleItemDelete ? 1 : 0);
    const actionWidth = actionCount * 80; // px per action button

    // compute total weight from headers for proportional column widths
    const totalWeight = headers.reduce(
        (sum, { columnWidth }) => sum + (columnWidth ?? 1),
        0
    );

    const columns = [
        // dynamic columns from headers with proportional widths
        ...headers.map(({ property, title, onClick, toggleIcon, columnWidth }) => {
            const weight = columnWidth ?? 1;
            const widthPercent = (weight / totalWeight) * 100;
            return {
                title,
                dataIndex: property,
                key: property,
                width: `${widthPercent}%`,
                render: (_, record) => {
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
                            {String(cell ?? '')
                                .charAt(0)
                                .toUpperCase() + String(cell ?? '').slice(1)}
                        </span>
                    );
                },
            };
        }),
    ];

    const actionColumn = // action column with dynamic width in px
    {
        title: 'Actions',
        key: 'actions',
        width: actionWidth,
        fixed: 'right',
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
    }
    if (actionCount > 0) columns.push(actionColumn)

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 capitalize">
                {tableTitle.replace(/_/g, ' ')}
            </h2>
            <Table
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                pagination={false}
                bordered
                size="middle"
                tableLayout="fixed"
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default ListTableManagementBody;
