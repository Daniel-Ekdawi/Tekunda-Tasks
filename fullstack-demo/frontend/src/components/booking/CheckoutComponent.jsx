"use client"

import GreenButton from '@/components/buttons/GreenButton';
import { useSession } from '@/components/context/SessionContext';
import { useNotification } from '@/components/context/NotificationContext';
import { createReservation } from '@/api/reservation';
import { useRouter } from 'next/navigation';

export default function CheckoutComponent({ room, startDate, endDate, closePopup }) {
    const router = useRouter()
    const { user } = useSession()
    const { setMessage } = useNotification()
    const roomId = room.id
    const hotelId = room.hotel_id
    const userId = user.id

    const numberOfDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    const total = room.price * numberOfDays

    const handleSubmit = async () => {
        setMessage({ text: 'Loading...', type: 'warning' })

        const reservationData = {
            start_date: startDate,
            end_date: endDate,
            user_id: userId,
            hotel_id: hotelId,
            room_id: roomId,
            status: "paid"
        }

        const result = await createReservation(reservationData)

        if (result?.error) return setMessage({ text: result.error || `Failed to complete the reservation!`, type: 'error' }) // error

        setMessage({ text: `Successfully completed reservation!`, type: 'success' }) // success
        router.push('/profile')
        closePopup()
    }

    return (
        <div className="p-4 flex flex-col gap-3 text-2xl">
            <h2 className="text-4xl font-bold text-center">Checkout</h2>
            <p>Room: {room.number}</p>
            <p>Price per day: ${room.price}</p>
            <p>Days: {numberOfDays}</p>
            <p>Total: ${total.toFixed(2)}</p>

            <GreenButton
                extraClasses="text-white mt-4"
                onClick={handleSubmit}
                text="Confirm"
            />
        </div>
    )
}