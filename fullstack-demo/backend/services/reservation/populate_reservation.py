from models.reservation import Reservation
from models.hotel import Hotel
from models.room import Room
from models.user import User

# populate models in reservation
async def populate_reservation(reservation: Reservation) -> Reservation:
    reservation.user = await User.get(reservation.user_id)
    reservation.hotel = await Hotel.get(reservation.hotel_id)
    reservation.room = await Room.get(reservation.room_id)

    return await reservation.custom_model_dump()
