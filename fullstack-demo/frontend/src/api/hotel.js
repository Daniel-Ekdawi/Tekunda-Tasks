import { BASE_URL } from "@/constants/URLS"

const createHotel = async (hotelData, id) => {
    const formattedData = {
        name: hotelData["Name"],
        phone_number: hotelData["Phone Number"],
        email: hotelData["Email"],
        swimming_pools: Number(hotelData["Swimming Pools"]),
        max_reservations: Number(hotelData["Max Reservations"]),
        gym: hotelData["Gym"],
        spa: hotelData["Spa"],
        wifi: hotelData["WiFi"],
        parking: hotelData["Parking"],
        hotel_admin_id: id
    }

    try {
        const response = await fetch(`${BASE_URL}/hotel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formattedData),
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

const getHotels = async (id) => {
    // id is the id of the hotelAdmin
    // if no id is passed then all hotels are fetched (for super_admin)

    try {
        const url = `${BASE_URL}/hotel` + (id ? `/hotelAdmin/${id}` : ``)
        const response = await fetch(url)
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const updateHotelById = async (id, updates) => {
    const formattedData = {
        name: updates["Name"],
        phone_number: updates["Phone Number"],
        email: updates["Email"],
        swimming_pools: Number(updates["Swimming Pools"]),
        max_reservations: Number(updates["Max Reservations"]),
        gym: updates["Gym"],
        spa: updates["Spa"],
        wifi: updates["WiFi"],
        parking: updates["Parking"],
        hotel_admin_id: id
    }

    try {
        const response = await fetch(`${BASE_URL}/hotel/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formattedData)
        })
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
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

export { createHotel, getHotelById, getHotels, updateHotelById, toggleHotelPropertyById, deleteHotelById }