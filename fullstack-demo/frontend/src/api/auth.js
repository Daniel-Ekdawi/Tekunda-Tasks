import { BASE_URL } from "@/constants/URLS"

const login = async userData => {
    const formattedData = {
        email: userData["Email"],
        password: userData["Password"],
    }

    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formattedData),
            credentials: "include"
        })
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const signup = async userData => {
    const formattedData = {
        username: userData["Username"],
        email: userData["Email"],
        password: userData["Password"],
        date_of_birth: userData["Date of Birth"],
        gender: userData["Gender"].toUpperCase(),
        mobile_number: userData["Phone Number"],
        job: userData["Job"],
        role: userData["Role"]
    }

    try {
        const response = await fetch(`${BASE_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formattedData),
            credentials: formattedData.role === 'hotel_admin' ? "omit" : "include"
        })

        const result = await response.json()
        
        if (result?.detail) {
            let errorMessage = 'An unknown error occured'
            if (typeof result.detail === 'string') {
                errorMessage = result.detail
            } else if (result.detail instanceof Array) {
                errorMessage = 'These fields are missing: \n'
                result.detail.forEach((entry, index) => {
                    errorMessage += `${index + 1}- ${entry.loc[1]}\n`
                })
            }
            throw new Error(errorMessage)
        }

        if (response.status !== 201) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const logout = async () => {
    try {
        const response = await fetch(`${BASE_URL}/user/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        const result = await response.json()
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { login, signup, logout }