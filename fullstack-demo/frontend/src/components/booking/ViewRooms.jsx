"use client"

import CheckoutComponent from "@/components/booking/CheckoutComponent";
import ListTableManagement from "@/components/shared/ListTableManagement/ListTableManagement"
import { usePopup } from '@/components/context/PopupContext';

const ViewerViewRoomsComponent = ({ rooms, setRooms, filters }) => {
    const { setPopup, clearPopup } = usePopup()

    const handleReservation = room => {
        setPopup({ 
            component: <CheckoutComponent room={room} startDate={filters.start_date} endDate={filters.end_date} closePopup={clearPopup} />,
            popupClasses: "w-[60vw]"
        })
    }

    const headers = [
        { property: "number", title: "Number" },
        { property: "price", title: "Price" },
        { property: "description", title: "Description" },
        { property: "type", title: "Type" },
    ]

    const buttons = [
        { title: "Reserve Now", onClick: handleReservation },
    ]
    
    if (!filters?.start_date || !filters?.end_date) return <div>Please select start and end dates!</div>

    return <ListTableManagement tables={rooms} setTables={setRooms} headers={headers} buttons={buttons} />
}

export default ViewerViewRoomsComponent