import { BASE_URL } from "@/constants/URLS"

const createRoom = async (roomData) => {
    const id = roomData.hotel_id
    const formattedData = {
        number: roomData["Number"],
        price: roomData["Price"],
        description: roomData["Description"],
        type: roomData["Type"],
        hotel_id: id
    }

    try {
        const response = await fetch(`${BASE_URL}/hotel/${id}/room`, {
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

const getRoomById = async (hotelId, roomId) => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${hotelId}/room/${roomId}`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getRooms = async (id) => {
    // id is the id of the hotel
    // if no id is passed then all rooms are fetched (for super_admin)

    try {
        const url = `${BASE_URL}/hotel${id ? `/${id}/room` : `/room/all`}`
        const response = await fetch(url)
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const updateRoomById = async (hotelId, roomId, updates) => {
    const formattedData = {
        number: updates["Number"],
        price: updates["Price"],
        description: updates["Description"],
        type: updates["Type"],
        hotel_id: hotelId,
    }

    try {
        const response = await fetch(`${BASE_URL}/hotel/${hotelId}/room/${roomId}`, {
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

const toggleRoomPropertyById = async (hotelId, roomId, updates) => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${hotelId}/room/${roomId}/toggle`, {
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

const deleteRoomById = async (hotelId, roomId) => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${hotelId}/room/${roomId}`, { method: 'DELETE' })
        const result = await response.json()

        if (!response.ok) throw new Error(result.detail)

        if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { createRoom, getRoomById, getRooms, updateRoomById, toggleRoomPropertyById, deleteRoomById }