import { BASE_URL } from "@/constants/URLS"
import handleAPIError from "@/api/shared/handleAPIError"

const createReservation = async reservationData => {
    try {
        const response = await fetch(`${BASE_URL}/reservation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reservationData),
        })
        const result = await response.json()
        handleAPIError({ result, response }, 201)
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const cancelReservationById = async reservationId => {
    try {
        const response = await fetch(`${BASE_URL}/reservation/${reservationId}`, { method: "POST" })
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getReservationsForHotel = async (hotelId, options = 'grouped') => {
    const params = new URLSearchParams({ options })
    try {
        const response = await fetch(`${BASE_URL}/reservation/hotel/${hotelId}?${params.toString()}`)
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getReservationsForRoom = async (roomId, hotelId, options = 'grouped') => {
    const params = new URLSearchParams({ options })
    try {
        const response = await fetch(`${BASE_URL}/reservation/hotel/${hotelId}/room/${roomId}?${params.toString()}`)
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const getReservationsByUser = async (userId, options = 'grouped') => {
    const params = new URLSearchParams({ options })
    try {
        const response = await fetch(`${BASE_URL}/reservation/user/${userId}?${params.toString()}`)
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

const deleteReservationById = async reservationId => {
    try {
        const response = await fetch(`${BASE_URL}/reservation/${reservationId}`, { method: 'DELETE' })
        const result = await response.json()
        handleAPIError({ result, response })
        return result
    } catch (error) {
        return { error: error.message }
    }
}

export { createReservation, cancelReservationById, getReservationsForHotel, getReservationsForRoom, getReservationsByUser, deleteReservationById }