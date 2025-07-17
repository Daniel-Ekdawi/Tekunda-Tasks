import InputField from '@/components/shared/Form/InputField';

import { useState, useEffect } from 'react';
import { getHotelIdsNames } from '@/api/hotel';
import CardWrapper from '@/components/wrappers/CardWrapper';

const ViewReservationHotelPicker = ({ userId, setHotelId }) => {
    const [formData, setFormData] = useState({})
    const [options, setOptions] = useState([])

    useEffect(() => {
        setHotelId(formData.hotel_id)
    }, [formData])

    useEffect(() => {
        const getOptions = async () => {
            const result = await getHotelIdsNames(userId)
            setOptions(result.map(hotel => ({ value: hotel.id, title: hotel.name })))
        }
        getOptions()
    }, [])


    const field = {
        property: 'hotel_id',
        title: "Hotel",
        tag: 'select',
        options,
        showLabel: false
    }

    return <div className="flex justify-center">
        <div className="w-[20%]">
            <CardWrapper>
            <InputField key={field.property} field={field} formData={formData} setFormData={setFormData} />
        </CardWrapper>
        </div>
    </div>

}

export default ViewReservationHotelPicker