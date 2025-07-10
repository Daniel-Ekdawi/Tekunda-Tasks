"use client"

import { getRooms, toggleRoomPropertyById } from "@/api/room"
import { useSession } from "@/components/context/SessionContext"
import ListTableManagement from "@/components/shared/ListTableManagement/ListTableManagement"
import { useNotification } from "../../context/NotificationContext"

const ViewRoomComponent = ({ hotel, rooms, setRooms, handleItemUpdate, handleItemDelete }) => {
    const { user } = useSession()
    const { setMessage } = useNotification()

    const handleRoomPropertyToggle = async (property, room) => {
        const hotelId = hotel._id
        const roomId = room._id
        const oldPropertyValue = room[property]

        const result = await toggleRoomPropertyById(hotelId, roomId, property)
        if (!result || result.error) return setMessage({ text: 'Something went wrong...', type: 'error' })

        const newPropertyValue = !oldPropertyValue
        room[property] = newPropertyValue

        setRooms(oldRoomsData => {
            const newRoomsData = {}
            Object.entries(oldRoomsData).forEach(table => {
                const [tableTitle, tableData] = table
                const newTableData = []
                tableData.forEach(table => {
                    if (table._id === roomId) {
                        table[property] = newPropertyValue
                    }
                    newTableData.push(table)
                })
                newRoomsData[tableTitle] = newTableData
            })
            return newRoomsData
        })
    }

    const headers = [
        { property: "number", title: "Number" },
        { property: "price", title: "Price" },
        { property: "description", title: "Description" },
        { property: "type", title: "Type" },
        // { property: "occupied", title: "Occupied", onClick: handleRoomPropertyToggle.bind(null, 'parking'), toggleIcon: true },
    ]
    // if user is not hotel admin then they shouldnt have the onClick function available
        .map(({ onClick, ...rest }) => user.role === "hotel_admin" ? { onClick, ...rest } : rest)

    const getRoomsAsObjects = async () => {
        const rooms = await getRooms(hotel?._id)
        if (hotel?._id) return { rooms }
        return rooms
    }
    
    return <ListTableManagement tables={rooms} setTables={setRooms} headers={headers} getTablesFunction={getRoomsAsObjects} deleteItemFunction={handleItemDelete} handleItemUpdate={handleItemUpdate} />
}

export default ViewRoomComponent