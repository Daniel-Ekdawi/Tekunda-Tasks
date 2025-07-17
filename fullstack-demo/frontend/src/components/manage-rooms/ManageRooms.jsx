'use client'

import RoomFormComponent from "@/components/manage-rooms/RoomForm";
import ViewRoomsComponent from "@/components/manage-rooms/ViewRooms"
import { useSession } from '@/components/context/SessionContext';
import { use, useEffect, useState } from "react"
import { useNotification } from "@/components/context/NotificationContext";
import { getHotelById } from "@/api/hotel";
import { deleteRoomById } from "@/api/room";

const ManageRoomsComponent = ({ params }) => {
    const { hotelId } = params ? use(params) : {}
    const [hotel, setHotel] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const { user } = useSession()
    const { setMessage } = useNotification()
    const [rooms, setRooms] = useState([])
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
        }

        getHotel()
    }, [hotelId])

    const handleRoomCreation = room => setRooms(oldRooms => ({ [`${hotel?.name} rooms`]: [...(oldRooms[`${hotel?.name} rooms`] || []), room] }))

    const handleRoomUpdate = room => setRooms(oldRooms => ({ [[`${hotel?.name} rooms`]]: (oldRooms[`${hotel?.name} rooms`] || []).map(currentRoom => currentRoom.id === room.id ? room : currentRoom) }));

    const handleItemUpdate = item => setRoomUpdating(oldValue => (oldValue?.id === item?.id ? { reset: true } : item))

    const handleItemDelete = (roomId) => deleteRoomById(hotelId, roomId)
    
    if (isLoading) return <div>Loading...</div>

    return <div className="mb-12">
        {/* add a hotel detail component here */}
        <div className="px-[2%]"><ViewRoomsComponent hotel={hotel} rooms={rooms} setRooms={setRooms} handleItemUpdate={user.role === 'hotel_admin' ? handleItemUpdate : undefined} handleItemDelete={user.role === 'hotel_admin' ? handleItemDelete : undefined} /></div>
        {user.role === 'hotel_admin' && <RoomFormComponent hotel={hotel} addRoom={handleRoomCreation} updateRoom={handleRoomUpdate} roomUpdating={roomUpdating} setRoomUpdating={setRoomUpdating} />}
    </div>
}

export default ManageRoomsComponent