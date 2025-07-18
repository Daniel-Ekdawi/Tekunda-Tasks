'use client'

import React, { useState, useEffect } from 'react'
import { Card, Avatar, Descriptions, Button, Spin, Input, DatePicker, Form, Switch } from 'antd'
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { useSession } from '@/components/context/SessionContext'
import { useNotification } from '@/components/context/NotificationContext'
import dayjs from 'dayjs'
import { updateUserById } from '@/api/user'

const editableFields = [
    { key: 'username', label: 'Username', component: Input },
    { key: 'email', label: 'Email', component: Input },
    { key: 'phone_number', label: 'Phone Number', component: Input },
    { key: 'date_of_birth', label: 'Date of Birth', component: DatePicker, transform: v => dayjs(v), valuePropName: 'value' },
    { key: 'gender', label: 'Gender', component: Input },
    { key: 'job', label: 'Job', component: Input },
    { key: 'age', label: 'Age', component: Input },
]

const ProfileComponent = () => {
    const { user, setUser } = useSession()
    const { setMessage } = useNotification()
    const [editing, setEditing] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        if (user) {
            const init = {}
            editableFields.forEach(({ key }) => {
                let val = user[key]
                // date picker expects dayjs
                init[key] = key === 'date_of_birth' && val ? dayjs(val) : val
            })
            form.setFieldsValue(init)
        }
    }, [user, form])

    if (!user) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <Spin tip="Loading profile..." size="large" />
            </div>
        )
    }

    const onSave = async () => {
        try {
            const values = await form.validateFields()
            const payload = {
                ...values,
                date_of_birth: values.date_of_birth
                    ? values.date_of_birth.format('YYYY-MM-DD')
                    : undefined,
            }
            // call update API here, then:
            const result = await updateUserById(user.id, payload)
            if (!result || result.error) return setMessage({ text: result?.error || 'Failed to update user!', type: 'error' })
            setUser({ ...user, ...payload })
            setMessage({ text: 'Profile updated!', type: 'success' })
            setEditing(false)
        } catch (err) {
            setMessage({ text: err.message || 'Update failed', type: 'error' })
        }
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Card variant="outlined" className="shadow-lg rounded-lg">
                <div className="flex flex-col items-center mb-6">
                    <Avatar
                        size={120}
                        icon={<UserOutlined />}
                        src={user.avatarUrl}
                        className="mb-4"
                    />
                    {!editing && (
                        <h2 className="text-2xl font-semibold">{user.username}</h2>
                    )}
                </div>

                {editing ? (
                    <Form form={form} layout="vertical" className="space-y-4">
                        {editableFields.map(({ key, label, component: Comp, valuePropName }) => (
                            <Form.Item
                                key={key}
                                name={key}
                                label={label}
                                valuePropName={valuePropName}
                            >
                                <Comp />
                            </Form.Item>
                        ))}
                    </Form>
                ) : (
                    <Descriptions
                        column={1}
                        variant="simple"
                        styles={{ label: { width: '30%' } }}
                    >
                        {editableFields.map(({ key, label }) => {
                            const val = user[key]
                            if (val === undefined || val === null) return null
                            const display =
                                key === 'date_of_birth'
                                    ? dayjs(val).format('YYYY-MM-DD')
                                    : typeof val === 'boolean'
                                        ? val
                                            ? 'Yes'
                                            : 'No'
                                        : String(val)
                            return (
                                <Descriptions.Item key={key} label={label}>
                                    {display}
                                </Descriptions.Item>
                            )
                        })}
                    </Descriptions>
                )}

                <div className="mt-6 flex justify-center space-x-4">
                    {!editing ? (
                        <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
                            Edit
                        </Button>
                    ) : (
                        <>
                            <Button
                                icon={<SaveOutlined />}
                                type="primary"
                                onClick={onSave}
                            >
                                Save
                            </Button>
                            <Button
                                icon={<CloseOutlined />}
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default ProfileComponent