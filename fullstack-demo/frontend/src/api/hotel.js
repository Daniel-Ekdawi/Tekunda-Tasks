import { BASE_URL } from "@/constants/URLS"

const getHotelById = async id => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${id}`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getHotels = async () => {
    try {
        const response = await fetch(`${BASE_URL}/hotel`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const updateHotelById = async (id, updates) => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        })
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const deleteHotelById = async id => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${id}`, { method: 'DELETE' })
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { getHotelById, getHotels, updateHotelById, deleteHotelById }