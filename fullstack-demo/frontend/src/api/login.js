import { BASE_URL } from "@/constants/URLs"

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
        
        if (response.status !== 200) throw new Error(result.detail)

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
        gender: userData["Gender"],
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
            body: JSON.stringify(formattedData)
        })
        const result = await response.json()

        if (result?.detail) {
            let errorMessage = 'These fields are missing: \n'
            result.detail.forEach((entry, index) => {
                errorMessage += `${index + 1}- ${entry.loc[1]}\n`
            })
            throw new Error(errorMessage)
        }

        if (response.status !== 201) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { login, signup }