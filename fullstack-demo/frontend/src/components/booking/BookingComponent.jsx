"use client"

import { useEffect, useState } from "react"
import ViewerViewRoomsComponent from '@/components/booking/ViewRooms';
import BookingSearchForm from "@/components/booking/BookingSearchForm";
import { getFilteredRooms } from "@/api/room"

const BookingComponent = () => {
    const [rooms, setRooms] = useState([])
    const [filters, setFilters] = useState({})

    useEffect(() => {
        const getRooms = async () => {
            const rooms = await getFilteredRooms(filters)
            setRooms(rooms)
        }

        if (filters?.start_date && filters?.end_date) getRooms()
    }, [filters])

    return <div className="mb-12">
        <div className="flex justify-center mb-3"><BookingSearchForm filters={filters} setFilters={setFilters} /></div>
        <div className="px-[2%]"><ViewerViewRoomsComponent rooms={rooms} setRooms={setRooms} filters={filters} /></div>
    </div>
}

export default BookingComponent