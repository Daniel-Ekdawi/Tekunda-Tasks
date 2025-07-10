import { HOTEL_FIELDS } from "@/constants/INPUT_FIELDS";
import InputField from '@/components/shared/Form/InputField';
import GreenButton from '@/components/buttons/GreenButton';
import { useEffect, useState } from "react";
import { createHotel, updateHotelById } from "@/api/hotel";
import { useNotification } from '@/components/context/NotificationContext';
import { useSession } from '@/components/context/SessionContext';

const HotelFormComponent = ({ addHotel, updateHotel, hotelUpdating, setHotelUpdating }) => {
    // addHotel: a hotel object added to the state of array of hotels after creation

    // updateHotel: the hotel object that was updated and is to be updated in the state of array of hotels

    // hotelUpdating, setHotelUpdating: useState variables for the hotel currently being updated

    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const { setMessage } = useNotification()
    const { user } = useSession()

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true)
        setMessage({ text: 'Loading...', type: 'warning' })

        const result = hotelUpdating ? await updateHotelById(formData) : await createHotel({ ...formData, hotel_admin_id: user.id, max_reservations: Number(formData.max_reservations), swimming_pools: Number(formData.swimming_pools) })
        setIsLoading(false)

        if (result?.error) return setMessage({ text: result.error || `Failed to ${hotelUpdating ? 'update' : 'create'} hotel!`, type: 'error' }) // error

        result.hotel_admin_id = user.id
        result.hotel_admin = { username: user.username }

        if (hotelUpdating) updateHotel(result)
        else addHotel(result)

        setMessage({ text: `Successfully ${hotelUpdating ? 'updated' : 'created'} hotel ${formData["Name"]}!`, type: 'success' }) // success
        setFormData({})
        setHotelUpdating()
    };

    // if a hotel is to be updated, the form is filled with its details and update mode instead of create mode
    useEffect(() => {
        if (hotelUpdating) {
            if (hotelUpdating.reset) {
                setFormData({})
                setHotelUpdating()
            } else {
                setFormData(hotelUpdating)
            }
        }
    }, [hotelUpdating])

    return (
        <div className="flex flex-col items-center">
            <form
                className="flex flex-col gap-3 bg-gray-600 p-4 rounded-xl text-white mt-[5%] w-[90%] max-w-md"
                onSubmit={handleSubmit}
            >
                <div className="text-3xl text-center mt-2 mb-4">{hotelUpdating ? "Update Hotel" : "Create Hotel"}</div>
                {HOTEL_FIELDS.map(field => <InputField key={field.property} field={field} formData={formData} setFormData={setFormData} />)}
                <GreenButton
                    text={hotelUpdating ? "Update Hotel" : "Create Hotel"}
                    type="submit"
                    disabled={isLoading || !HOTEL_FIELDS.every(field => field.required ? formData[field.property]?.toString().trim() : true)}
                />
            </form>
        </div>
    );
}

export default HotelFormComponent