import RedButton from '@/components/buttons/RedButton';

const ReservationCancelComponent = ({ cancelReservation, reservation }) => {
    const handleClick = () => cancelReservation(reservation)

    return <div className='flex flex-col gap-3 items-center'>
        <h1 className='text-2xl text-nowrap text-red-500'>Are you sure you want to cancel this reservation?</h1>
        <RedButton text='Cancel' onClick={handleClick} extraClasses='text-white max-w-fit text-xl px-4' />
    </div>
}

export default ReservationCancelComponent