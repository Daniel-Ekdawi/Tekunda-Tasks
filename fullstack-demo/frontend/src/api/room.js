import { BASE_URL } from "@/constants/URLS"
import handleAPIError from "@/api/shared/handleAPIError"

const createRoom = async (roomData) => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${roomData.hotel_id}/room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(roomData),
        })
        const result = await response.json()
        handleAPIError({ result, response }, 201)
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getRoomById = async (hotelId, roomId) => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${hotelId}/room/${roomId}`)
        const result = await response.json()
        handleAPIError({ result, response })
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
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const updateRoomById = async newRoomData => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${newRoomData.hotel_id}/room/${newRoomData._id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newRoomData)
        })
        const result = await response.json()
        handleAPIError({ result, response })
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
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const deleteRoomById = async (hotelId, roomId) => {
    try {
        const response = await fetch(`${BASE_URL}/hotel/${hotelId}/room/${roomId}`, { method: 'DELETE' })
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { createRoom, getRoomById, getRooms, updateRoomById, toggleRoomPropertyById, deleteRoomById }