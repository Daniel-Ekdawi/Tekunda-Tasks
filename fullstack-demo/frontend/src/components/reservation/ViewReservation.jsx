"use client"

import ListTableManagement from '@/components/shared/ListTableManagement/ListTableManagement';
import { useSession } from '@/components/context/SessionContext';
import { usePopup } from '@/components/context/PopupContext';
import { cancelReservationById, getReservationsByUser, getReservationsForHotel } from '@/api/reservation';
import ReservationCancelComponent from '@/components/reservation/ReservationCancelComponent';
import { useEffect, useState } from 'react';
import { useNotification } from '@/components/context/NotificationContext';

const ViewReservation = ({ hotelId }) => {
    const { user } = useSession()
    const { setMessage } = useNotification()
    const { setPopup, clearPopup } = usePopup()
    const [reservations, setReservations] = useState([])

    const cancelReservation = async reservation => {
        const result = await cancelReservationById(reservation.id)
        if (!result || result.error) return setMessage({ text: result?.error || 'An error occured while fetching data', type: 'error' })
        setReservations(oldData => {
            const updatedReservations = {}
            for (const key of ['past', 'ongoing', 'future']) updatedReservations[key] = oldData[key].map(currentReservation => currentReservation.id === reservation.id ? { ...currentReservation, status: 'cancelled' } : currentReservation)
            return updatedReservations
        })
        setMessage({ text: 'Successfully cancelled the reservation!', type: 'success' })
        clearPopup()
    }

    const handleCancel = reservation => {
        setPopup({
            component: <ReservationCancelComponent cancelReservation={cancelReservation} reservation={reservation} />,
        })
    }

    const headers = [
        { property: 'hotel.name', title: 'Hotel' },
        { property: 'room.number', title: 'Room #' },
        { property: 'start_date', title: 'Start Date' },
        { property: 'end_date', title: 'End Date' },
        { property: 'user.username', title: 'User' },
        { property: 'status', title: 'Status' },
    ]

    const buttons = [
        { title: 'Cancel', onClick: handleCancel }
    ]
    .filter(button => user.role === 'viewer' && button.title === 'Cancel')

    const getGroupedReservations = async () => {
        if (user.role === 'viewer') return await getReservationsByUser(user.id)
        if (hotelId) return await getReservationsForHotel(hotelId)
    }

    return <ListTableManagement tables={reservations} setTables={setReservations} headers={headers} buttons={buttons} getTablesFunction={getGroupedReservations} getTablesFunctionDependencies={user.role === 'viewer' ? [] : [hotelId]} />
}

export default ViewReservation