import ManageRoomsComponent from "@/components/manage-rooms/ManageRooms"

const HotelDetails = ({ params }) => {
    return <div className="mt-[10%]">
        <ManageRoomsComponent params={params} />
    </div>
}

export default HotelDetails