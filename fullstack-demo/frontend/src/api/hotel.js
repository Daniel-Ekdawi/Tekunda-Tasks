import { BASE_URL } from "@/constants/URLS"
import handleAPIError from "@/api/shared/handleAPIError"

const createHotel = async hotelData => {
    try {
        const response = await fetch(`${BASE_URL}/hotel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(hotelData),
        })
        const result = await response.json()
        handleAPIError({ result, response }, 201)
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getHotelById = async id => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${id}`)
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getHotels = async (id) => {
    // id is the id of the hotelAdmin
    // if no id is passed then all hotels are fetched (for super_admin)

    try {
        const url = `${BASE_URL}/hotel` + (id ? `/hotelAdmin/${id}` : ``)
        const response = await fetch(url)
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const updateHotelById = async newHotelData => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${newHotelData._id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newHotelData)
        })
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const toggleHotelPropertyById = async (id, updates) => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${id}/toggle`, {
            method: 'POST',
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

const deleteHotelById = async id => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${id}`, { method: 'DELETE' })
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { createHotel, getHotelById, getHotels, updateHotelById, toggleHotelPropertyById, deleteHotelById }