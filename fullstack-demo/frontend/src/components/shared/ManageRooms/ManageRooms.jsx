'use client'

import RoomFormComponent from "@/components/hotelAdmin/RoomForm";
import ViewRoomComponent from "./ViewRooms"
import { useSession } from '@/components/context/SessionContext';
import { useEffect, useState } from "react"
import { useNotification } from "@/components/context/NotificationContext";
import { getHotelById } from "@/api/hotel";

const ManageRoomsComponent = ({ hotelId }) => {
    const [hotel, setHotel] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const { user } = useSession()
    const { setMessage } = useNotification()
    const [rooms, setRooms] = useState()
    const [roomUpdating, setRoomUpdating] = useState()

    // load hotel data
    useEffect(() => {
        const getHotel = async () => {
            if (!hotelId) return setIsLoading(false) // if not hotelId provided dont fetch
            setIsLoading(true)
            const result = await getHotelById(hotelId)
            setIsLoading(false)
            if (result?.error) return setMessage({ text: result.error || 'Failed to retreive hotel data!', type: 'error' }) // error
            setHotel(result)
            setRooms(result.rooms)
        }

        getHotel()
    }, [hotelId])

    const handleRoomCreation = room => setRooms(oldRooms => ({ rooms: [...(oldRooms.rooms || []), room] }))

    const handleRoomUpdate = room => setRooms(oldRooms => ({ rooms: (oldRooms.rooms || []).map(currentRoom => currentRoom._id === room._id ? room : currentRoom) }));

    const handleItemUpdate = item => setRoomUpdating(oldValue => (oldValue ? { reset: true } : item))

    const handleItemDelete = (roomId) => deleteRoomById(hotelId, roomId)
    
    if (isLoading) return <div>Loading...</div>

    return <div className="mb-12">
        {/* add a hotel detail component here */}
        <div className="px-[2%]"><ViewRoomComponent hotel={hotel} rooms={rooms} setRooms={setRooms} handleItemUpdate={user.role === 'hotel_admin' ? handleItemUpdate : undefined} handleItemDelete={user.role === 'hotel_admin' ? handleItemDelete : undefined} /></div>
        {user.role === 'hotel_admin' && <RoomFormComponent hotel={hotel} addRoom={handleRoomCreation} updateRoom={handleRoomUpdate} roomUpdating={roomUpdating} setRoomUpdating={setRoomUpdating} />}
    </div>
}

export default ManageRoomsComponent