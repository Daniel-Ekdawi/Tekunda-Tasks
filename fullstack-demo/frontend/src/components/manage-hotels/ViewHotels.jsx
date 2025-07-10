"use client"

import { getHotels, toggleHotelPropertyById } from "@/api/hotel"
import { useSession } from "@/components/context/SessionContext"
import ListTableManagement from "@/components/shared/ListTableManagement/ListTableManagement"
import { useNotification } from "@/components/context/NotificationContext"
import { usePathname, useRouter } from "next/navigation"

const ViewHotelsComponent = ({ hotels, setHotels, handleItemDelete, handleItemUpdate }) => {
    const { user } = useSession()
    const { setMessage } = useNotification()
    const router = useRouter()
    const pathname = usePathname()

    const handleHotelPropertyToggle = async (property, hotel) => {
        const id = hotel._id
        const oldPropertyValue = hotel[property]

        const result = await toggleHotelPropertyById(id, property)
        if (!result || result.error) return setMessage({ text: 'Something went wrong...', type: 'error' })

        const newPropertyValue = !oldPropertyValue
        hotel[property] = newPropertyValue

        setHotels(oldHotelsData => {
            const newHotelsData = {}
            Object.entries(oldHotelsData).forEach(table => {
                const [tableTitle, tableData] = table
                const newTableData = []
                tableData.forEach(table => {
                    if (table._id === id) {
                        table[property] = newPropertyValue
                    }
                    newTableData.push(table)
                })
                newHotelsData[tableTitle] = newTableData
            })
            return newHotelsData
        })
    }

    const handleHotelItemClick = hotel => router.push(`${pathname}/${hotel._id}`)

    const headers = [
        { property: "name", title: "Name", onClick: handleHotelItemClick },
        { property: "phone_number", title: "Phone Number" },
        { property: "email", title: "Email" },
        { property: "swimming_pools", title: "Pools" },
        { property: "max_reservations", title: "Max Capacity" },
        { property: "gym", title: "Gym", onClick: handleHotelPropertyToggle.bind(null, 'gym'), toggleIcon: true },
        { property: "spa", title: "Spa", onClick: handleHotelPropertyToggle.bind(null, 'spa'), toggleIcon: true },
        { property: "wifi", title: "Wi-Fi", onClick: handleHotelPropertyToggle.bind(null, 'wifi'), toggleIcon: true },
        { property: "parking", title: "Parking", onClick: handleHotelPropertyToggle.bind(null, 'parking'), toggleIcon: true },
        { property: "hotel_admin.username", title: "Hotel Admin" },
    ]
    // if user is not hotel admin then they shouldnt have the onClick function available
        .map(({ onClick, property, ...rest }) => user.role === "hotel_admin" || property === 'name' ? { onClick, property, ...rest } : { property, ...rest })

        
    const getHotelsAsObjects = async id => {
        const hotels = await getHotels(id)
        return { hotels }
    }

    return <ListTableManagement tables={hotels} setTables={setHotels} headers={headers} getTablesFunction={getHotelsAsObjects.bind(null, user.role === 'hotel_admin' ? user.id : null)} deleteItemFunction={handleItemDelete} handleItemUpdate={handleItemUpdate} />
}

export default ViewHotelsComponent