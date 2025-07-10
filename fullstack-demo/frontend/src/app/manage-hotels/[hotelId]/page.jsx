"use client"

import ManageRoomsComponent from "@/components/shared/ManageRooms/ManageRooms"
import { use } from "react"

const HotelDetails = ({ params }) => {
    const { hotelId } = use(params)

    return <div className="mt-[10%]">
        <ManageRoomsComponent hotelId={hotelId} />
    </div>
}

export default HotelDetails