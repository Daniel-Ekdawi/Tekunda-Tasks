import { ROOM_FIELDS } from "@/constants/INPUT_FIELDS";
import InputField from '@/components/shared/Form/InputField';
import GreenButton from '@/components/buttons/GreenButton';
import { useEffect, useState } from "react";
import { createRoom, updateRoomById } from "@/api/room";
import { useNotification } from '@/components/context/NotificationContext';

const RoomFormComponent = ({ hotel, addRoom, updateRoom, roomUpdating, setRoomUpdating }) => {
    // addRoom: a room object added to the state of array of rooms after creation

    // updateRoom: the room object that was updated and is to be updated in the state of array of rooms

    // roomUpdating, setRoomUpdating: useState variables for the room currently being updated

    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const { setMessage } = useNotification()

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true)
        setMessage({ text: 'Loading...', type: 'warning' })

        formData.hotel_id = hotel._id
        const result = roomUpdating ? await updateRoomById(formData) : await createRoom(formData)
        setIsLoading(false)

        if (result?.error) return setMessage({ text: result.error || `Failed to ${roomUpdating ? 'update' : 'create'} room!`, type: 'error' }) // error

        // result.hotel_admin_id = hotel._id
        if (roomUpdating) updateRoom(result)
        else addRoom(result)

        setMessage({ text: `Successfully ${roomUpdating ? 'updated' : 'created'} room ${formData.number}!`, type: 'success' }) // success
        setFormData({})
        setRoomUpdating()
    };

    // if a hotel is to be updated, the form is filled with its details and update mode instead of create mode
    useEffect(() => {
        if (roomUpdating) {
            if (roomUpdating.reset) {
                setFormData({})
                setRoomUpdating()
            }
            else {
                setFormData(roomUpdating)
            }
        }
    }, [roomUpdating])

    return (
        <div className="flex flex-col items-center">
            <form
                className="flex flex-col gap-3 bg-gray-600 p-4 rounded-xl text-white mt-[5%] w-[90%] max-w-md"
                onSubmit={handleSubmit}
            >
                <div className="text-3xl text-center mt-2 mb-4">{roomUpdating ? "Update Room" : "Create Room"}</div>
                {ROOM_FIELDS.map(field => <InputField key={field.property} field={field} formData={formData} setFormData={setFormData} />)}
                <GreenButton
                    text={roomUpdating ? "Update Room" : "Create Room"}
                    type="submit"
                    disabled={isLoading || !formData || !ROOM_FIELDS.every(field => field.required ? formData[field.property]?.toString().trim() : true)}
                />
            </form>
        </div>
    );
}

export default RoomFormComponent