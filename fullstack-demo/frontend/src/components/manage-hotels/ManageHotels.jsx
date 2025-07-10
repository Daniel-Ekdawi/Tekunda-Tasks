'use client'

import HotelFormComponent from "@/components/manage-hotels/HotelForm"
import ViewHotelsComponent from "@/components/manage-hotels/ViewHotels"
import { useSession } from '@/components/context/SessionContext';
import { useState } from "react"
import { deleteHotelById } from "@/api/hotel";

const ManageHotelsComponent = () => {
    const { user } = useSession()
    const [hotels, setHotels] = useState([])
    const [hotelUpdating, setHotelUpdating] = useState()

    const handleHotelCreation = hotel => setHotels(oldHotels => ({ hotels: [...(oldHotels.hotels || []), hotel] }))

    const handleHotelUpdate = hotel => setHotels(oldHotels => ({ hotels: (oldHotels.hotels || []).map(currentHotel => currentHotel._id === hotel._id ? hotel : currentHotel) }));

    const handleItemUpdate = item => setHotelUpdating(oldValue => (oldValue?._id === item?._id ? { reset: true } : item))

    return <div className="mb-12">
        <div className="px-[2%]"><ViewHotelsComponent hotels={hotels} setHotels={setHotels} handleItemUpdate={user.role === 'hotel_admin' ? handleItemUpdate : undefined} handleItemDelete={deleteHotelById} /></div>
        {user.role === 'hotel_admin' && <HotelFormComponent addHotel={handleHotelCreation} updateHotel={handleHotelUpdate} hotelUpdating={hotelUpdating} setHotelUpdating={setHotelUpdating} />}
    </div>
}

export default ManageHotelsComponent