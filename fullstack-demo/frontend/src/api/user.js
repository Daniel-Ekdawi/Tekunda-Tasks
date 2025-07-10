import { BASE_URL } from "@/constants/URLS"
import handleAPIError from "@/api/shared/handleAPIError"

const getUserById = async id => {
    try {
        const response = await fetch(`${BASE_URL}/user/${id}`)
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getAllUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/user`)
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getAllUsersCategorized = async () => {
    try {
        const users = await getAllUsers()

        const categorizedUsers = users.reduce((acc, user) => {
            const { role } = user;
            if (!acc[role]) acc[role] = [];
            acc[role].push(user);
            return acc;
        }, {
            viewer: [],
            hotel_admin: [],
            super_admin: []
        })
        
        return categorizedUsers
    } catch (error) {
        return { error: error.message }
    }
}

const updateUserById = async (id, updates) => {
    try {
        const response = await fetch(`${BASE_URL}/user/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        })
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const toggleUserActiveById = async id => {
    try {
        const response = await fetch(`${BASE_URL}/user/${id}/active`, { method: 'POST' })
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const deleteUserById = async id => {
    try {
        const response = await fetch(`${BASE_URL}/user/${id}`, { method: 'DELETE' })
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { getUserById, getAllUsers, getAllUsersCategorized, updateUserById, toggleUserActiveById, deleteUserById }