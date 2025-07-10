"use client"

import { useState } from 'react'
import { deleteUserById, getAllUsersCategorized, toggleUserActiveById } from "@/api/user";
import ListTableManagement from "../shared/ListTableManagement/ListTableManagement";

const ManageAllUsersComponent = () => {
    const [users, setUsers] = useState()

    const handleUserActiveToggle = async (user) => {
        const id = user._id
        const oldActiveValue = user.is_active
        const result = await toggleUserActiveById(id)
        if (!result || result.error) return setMessage({ text: 'Something went wrong...', type: 'error' })
        const newActiveValue = !oldActiveValue
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

    const headers = [
        { property: "username", title: "Username" },
        { property: "email", title: "Email" },
        { property: "job", title: "Job" },
        { property: "date_of_birth", title: "Date of Birth" },
        { property: "gender", title: "Gender" },
        { property: "mobile_number", title: "Phone Number" },
        { property: "is_active", title: "Active Status", onClick: handleUserActiveToggle, toggleIcon: true },
    ];

    return <ListTableManagement tables={users} setTables={setUsers} headers={headers} getTablesFunction={getAllUsersCategorized} deleteItemFunction={deleteUserById} />
}

export default ManageAllUsersComponent