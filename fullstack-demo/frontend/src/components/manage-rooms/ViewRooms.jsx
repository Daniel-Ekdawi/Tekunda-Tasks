"use client"

import { getRooms, toggleRoomPropertyById } from "@/api/room"
import { useSession } from "@/components/context/SessionContext"
import ListTableManagement from "@/components/shared/ListTableManagement/ListTableManagement"
import { useNotification } from "@/components/context/NotificationContext"

const ViewRoomsComponent = ({ hotel, rooms, setRooms, handleItemUpdate, handleItemDelete }) => {
    const { user } = useSession()
    const { setMessage } = useNotification()

    const handleRoomPropertyToggle = async (property, room) => {
        const hotelId = hotel.id
        const roomId = room.id
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
                    if (table.id === roomId) {
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
        { property: "description", title: "Description", columnWidth: 3 },
        { property: "type", title: "Type" },
        // { property: "occupied", title: "Occupied", onClick: handleRoomPropertyToggle.bind(null, 'parking'), toggleIcon: true },
    ]
    // if user is not hotel admin then they shouldnt have the onClick function available
        .map(({ onClick, ...rest }) => user.role === "hotel_admin" ? { onClick, ...rest } : rest)

    const getRoomsAsObjects = async () => {
        const rooms = await getRooms(hotel?.id)
        if (hotel?.id) return { [`${hotel.name} rooms`]: (Object.values(rooms).length > 0 ? Object.values(rooms)[0] : []) }
        return rooms
    }
    
    return <ListTableManagement tables={rooms} setTables={setRooms} headers={headers} getTablesFunction={getRoomsAsObjects} deleteItemFunctionById={handleItemDelete} handleItemUpdate={handleItemUpdate} />
}

export default ViewRoomsComponent