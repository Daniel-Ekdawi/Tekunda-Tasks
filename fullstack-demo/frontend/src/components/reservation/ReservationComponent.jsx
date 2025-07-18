"use client"

import ViewReservation from "@/components/reservation/ViewReservation"
import ViewReservationHotelPicker from "@/components/reservation/ViewReservationHotelPicker"
import { useSession } from '@/components/context/SessionContext';
import { useState } from 'react'

const ReservationComponent = () => {
    const { user } = useSession()
    const [hotelId, setHotelId] = useState()
    return <div>
        {user.role !== 'viewer' && <div><ViewReservationHotelPicker userId={user.role === 'hotel_admin' ? user.id : undefined} setHotelId={setHotelId} /></div>}        
        {(user.role === 'viewer' || hotelId) && <div><ViewReservation hotelId={hotelId} /></div>}    
    </div>
}

export default ReservationComponent