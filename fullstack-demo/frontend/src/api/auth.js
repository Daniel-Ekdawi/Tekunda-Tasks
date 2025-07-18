import { BASE_URL } from "@/constants/URLS"
import handleAPIError from "@/api/shared/handleAPIError"

const login = async userData => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: "include"
        })
        const result = await response.json()

        handleAPIError({ result, response })

        return result
    } catch (error) {
        return { error: error.message }
    }
}

const signup = async userData => {
    try {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: userData.role === 'hotel_admin' ? "omit" : "include"
        })

        const result = await response.json()

        handleAPIError({ result, response }, 201)
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const logout = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        const result = await response.json()
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const validateToken = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/validateToken`, {
            credentials: 'include',
        });
        const result = await response.json()
        handleAPIError({ result, response })
        const userData = result
        if (!userData.role) throw new Error()
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { login, signup, logout, validateToken }