"use client"

import { useEffect, useState } from "react"
import { useNotification } from "../context/NotificationContext"
import { getHotels } from "@/api/hotel"
import { useSession } from "../context/SessionContext"

const ViewHotelsComponent = () => {
    const [hotels, setHotels] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { setMessage } = useNotification()
    const { user } = useSession()

    useEffect(() => {
        const initializeHotels = async () => {
            setIsLoading(true)
            const result = await getHotels(user.id)
            setIsLoading(false)
            if (!result || result.error) return setMessage({ text: result?.error || 'An error occured while fetching hotels', type: 'error' })
            setHotels(result)
        }

        initializeHotels()
    }, [])

    return <div>
        {isLoading && "Loading..."}
        {!isLoading && hotels.length === 0 && "There are no hotels..."}
        {!isLoading && hotels.length > 0 && <div>
            {hotels.map(hotel => "This is a hotel")}
        </div>}
    </div>
}

export default ViewHotelsComponent