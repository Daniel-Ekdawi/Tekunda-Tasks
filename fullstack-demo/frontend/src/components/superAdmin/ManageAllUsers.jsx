"use client"

import { FaTrashAlt } from "react-icons/fa";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { useNotification } from "../context/NotificationContext";
import { useSession } from "../context/SessionContext";

const { getAllUsersCategorized, toggleUserActiveById, deleteUserById } = require("@/api/user")
const { useState, useEffect } = require("react")

const ManageAllUsersComponent = () => {
    const { user } = useSession()
    const [users, setUsers] = useState()
    const { setMessage } = useNotification()

    const headers = [
        { property: "username", title: "Username" },
        { property: "email", title: "Email" },
        { property: "job", title: "Job" },
        { property: "date_of_birth", title: "Date of Birth" },
        { property: "gender", title: "Gender" },
        { property: "mobile_number", title: "Phone Number" },
        { property: "is_active", title: "Active Status" },
    ];

    useEffect(() => {
        const getUsers = async () => {
            const result = await getAllUsersCategorized()
            setUsers(result)
        }

        getUsers()
    }, [])

    const handleUserActiveToggle = async id => {
        const result = await toggleUserActiveById(id)
        if (!result || result.error) return setMessage({ text: 'Something went wrong...', type: 'error' })
        const newActiveValue = !user.is_active
        user.is_active = newActiveValue
        setUsers(oldUsersData => {
            const newUserData = {}
            Object.entries(oldUsersData).forEach(category => {
                const [role, categorizedUsersGroup] = category
                const newCategorizedUsersGroup = []
                categorizedUsersGroup.forEach(user => {
                    if (user._id === id) {
                        user.is_active = newActiveValue
                    }
                    newCategorizedUsersGroup.push(user)
                    console.log(newCategorizedUsersGroup)
                })
                newUserData[role] = newCategorizedUsersGroup
            })
            return newUserData
        })
    }

    const handleUserDelete = async id => {
        if (user.id === id) console.log('yay')
        console.log(user)
        return
        const result = await deleteUserById(id)
        if (!result || result.error) return setMessage({ text: 'Something went wrong...', type: 'error' })
        const newActiveValue = !user.is_active
        user.is_active = newActiveValue
        setUsers(oldUsersData => {
            const newUserData = {}
            Object.entries(oldUsersData).forEach(category => {
                const [role, categorizedUsersGroup] = category
                const newCategorizedUsersGroup = []
                categorizedUsersGroup.forEach(user => {
                    if (user._id === id) {
                        user.is_active = newActiveValue
                    }
                    newCategorizedUsersGroup.push(user)
                })
                newUserData[role] = newCategorizedUsersGroup
            })
            return newUserData
        })

    }

    return (
        <div>
            {users && Object.entries(users).map(([role, usersInRole]) => (
                <div key={role} className="mb-6">
                    <h2 className="font-semibold text-lg mb-2 capitalize">{role.replace('_', ' ')}</h2>

                    {/* Table header */}
                    <table className="w-[95%] border md:text-sm text-xs table-fixed break-words">
                        <thead className="bg-gray-100">
                            <tr>
                                {headers.map(({ title }) => (
                                    <th key={title} className="p-2 border">{title}</th>
                                ))}
                            </tr>
                        </thead>
                    </table>

                    {/* Table rows with delete button outside */}
                    <div className="space-y-1">
                        {usersInRole.map((user, idx) => (
                            <div key={idx} className="flex items-center break-words">
                                <table className="w-[95%] text-sm table-fixed">
                                    <tbody>
                                        <tr className="text-center">
                                            {headers.map(({ property }) => (
                                                <td key={property} className="p-2 border">
                                                    {property === "is_active" ? (
                                                        <button
                                                            onClick={() => handleUserActiveToggle(user._id)}
                                                            className="flex items-center justify-center w-full"
                                                        >
                                                            {user[property] ? (
                                                                <MdToggleOn className="text-green-500 text-3xl transition-all hover:cursor-pointer hover:text-green-700" />
                                                            ) : (
                                                                <MdToggleOff className="text-gray-400 text-3xl transition-all hover:cursor-pointer hover:text-gray-600" />
                                                            )}
                                                        </button>
                                                    ) : (
                                                        user[property] || "-"
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Delete icon */}
                                <button onClick={() => handleUserDelete(user._id)} className="ml-2 text-red-500 hover:text-red-700">
                                    <FaTrashAlt className="text-lg transition-all hover:shadow-2xl hover:cursor-pointer" />
                                </button>
                            </div>
                        ))}

                        {usersInRole.length === 0 && (
                            <div className="p-2 text-center text-gray-500 border">
                                No users in this role.
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ManageAllUsersComponent