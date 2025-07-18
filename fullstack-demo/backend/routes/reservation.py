from fastapi import APIRouter, HTTPException, status
from typing import List, Literal, Optional, Union

from services.reservation.get_reservations_options import get_reservations_options
from models.reservation import GroupedReservations, Reservation, ReservationCreate, ReservationResponse
from models.room import Room
from models.hotel import Hotel
from models.user import User

router = APIRouter()
    
# create reservation
@router.post("/", response_model=ReservationResponse, response_model_exclude_none=True, status_code=status.HTTP_201_CREATED)
async def create_reservation(data: ReservationCreate):
    try:
        # check if hotel, room, user exist
        hotel = await Hotel.get(data.hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        
        room = await Room.get(data.room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")

        if room.hotel_id != data.hotel_id:
            raise HTTPException(status_code=400, detail="Room does not belong to the specified hotel")

        user = await User.get(data.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # check for conflicts
        conflict = await Reservation.find({
            "room_id": data.room_id,
            "status": {"$ne": "cancelled"},
            "$or": [{
                "start_date": {"$lt": data.end_date},
                "end_date": {"$gt": data.start_date}
            }]
        }).to_list()

        if conflict:
            raise HTTPException(status_code=400, detail="Room is already reserved for the selected dates")

        reservation = Reservation(**data.model_dump())

        await reservation.insert()
        return await reservation.custom_model_dump()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# cancel reservation
@router.post("/{reservation_id}", response_model=ReservationResponse, response_model_exclude_none=True)
async def cancel_reservation(reservation_id: str):
    try:
        reservation = await Reservation.get(reservation_id)
        if not reservation:
            raise HTTPException(status_code=404, detail="Reservation not found")

        status = reservation.status     
        if status == "cancelled":
            raise HTTPException(status_code=400, detail="Reservation is already cancelled")

        reservation.status = "cancelled"
        await reservation.save()

        return await reservation.custom_model_dump()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get reservations for a hotel
# options: grouped / ongoing / past / future / None
@router.get("/hotel/{hotel_id}", response_model=Union[List[ReservationResponse], GroupedReservations])
async def get_all_reservations_for_hotel(hotel_id: str, options: Optional[Literal["grouped", "ongoing", "past", "future"]] = None):
    try:
        query = {"hotel_id": hotel_id}
        return await get_reservations_options(query, options)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get reservations for a room in a hotel
# options: grouped / ongoing / past / future / None
@router.get("/hotel/{hotel_id}/room/{room_id}", response_model=Union[List[ReservationResponse], GroupedReservations])
async def get_all_reservations_for_hotel(hotel_id: str, room_id: str, options: Optional[Literal["grouped", "ongoing", "past", "future"]] = None):
    try:
        query = {"hotel_id": hotel_id, "room_id": room_id}
        return await get_reservations_options(query, options)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get reservations by user
# options: grouped / ongoing / past / future / None
@router.get("/user/{user_id}", response_model=Union[List[ReservationResponse], GroupedReservations])
async def get_all_reservations_for_hotel(user_id: str, options: Optional[Literal["grouped", "ongoing", "past", "future"]] = None):
    try:
        query = {"user_id": user_id}
        return await get_reservations_options(query, options)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# delete a reservation by id
@router.delete("/{reservation_id}", response_model=ReservationResponse)
async def delete_reservation(reservation_id: str):
    reservation = await Reservation.get(reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    await reservation.delete()
    return await reservation.custom_model_dump()
