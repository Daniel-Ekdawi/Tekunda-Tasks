import asyncio
from fastapi import APIRouter, HTTPException, status
from datetime import date
from typing import List

from lib.room_reservation_service import populate_reservation
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
            "$or": [
                {
                    "start_date": {"$lt": data.end_date},
                    "end_date": {"$gt": data.start_date}
                }
            ]
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



# get all reservations for a hotel
@router.get("/hotel/{hotel_id}", response_model=List[ReservationResponse])
async def get_all_reservations_for_hotel(hotel_id: str):
    try:
        reservations = await Reservation.find({"hotel_id": hotel_id}).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get grouped reservations for a hotel
@router.get("/hotel/{hotel_id}/grouped", response_model=GroupedReservations)
async def get_grouped_reservations_for_hotel(hotel_id: str):
    try:
        today = date.today()
        all_reservations = await Reservation.find({"hotel_id": hotel_id}).to_list()
        populated_reservations = await asyncio.gather(*[populate_reservation(r) for r in all_reservations])

        past = []
        ongoing = []
        future = []

        for res in populated_reservations:
            if res["end_date"] < today:
                past.append(res)
            elif res["start_date"] > today:
                future.append(res)
            else:
                ongoing.append(res)

        return GroupedReservations(past=past, ongoing=ongoing, future=future)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get ongoing reservations for a hotel
@router.get("/hotel/{hotel_id}/ongoing", response_model=List[ReservationResponse])
async def get_ongoing_reservations_for_hotel(hotel_id: str):
    try:
        today = date.today()
        reservations = await Reservation.find({
            "hotel_id": hotel_id,
            "start_date": {"$lte": today},
            "end_date": {"$gte": today}
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get past reservations for a hotel
@router.get("/hotel/{hotel_id}/past", response_model=List[ReservationResponse])
async def get_past_reservations_for_hotel(hotel_id: str):
    try:
        today = date.today()
        reservations = await Reservation.find({
            "hotel_id": hotel_id,
            "end_date": {"$lt": today}
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get future reservations for a hotel
@router.get("/hotel/{hotel_id}/future", response_model=List[ReservationResponse])
async def get_future_reservations_for_hotel(hotel_id: str):
    try:
        today = date.today()
        reservations = await Reservation.find({
            "hotel_id": hotel_id,
            "start_date": {"$gt": today}
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


# get all reservations for a room in a hotel
@router.get("/hotel/{hotel_id}/room/{room_id}", response_model=List[ReservationResponse])
async def get_all_reservations_for_room(hotel_id: str, room_id: str):
    try:
        reservations = await Reservation.find({
            "hotel_id": hotel_id,
            "room_id": room_id
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get grouped reservations for a room in a hotel
@router.get("/hotel/{hotel_id}/room/{room_id}/grouped", response_model=GroupedReservations)
async def get_grouped_reservations_for_room(hotel_id: str, room_id: str):
    try:
        today = date.today()
        all_reservations = await Reservation.find({
            "hotel_id": hotel_id,
            "room_id": room_id
        }).to_list()
        populated_reservations = await asyncio.gather(*[populate_reservation(r) for r in all_reservations])

        past = []
        ongoing = []
        future = []

        for res in populated_reservations:
            if res["end_date"] < today:
                past.append(res)
            elif res["start_date"] > today:
                future.append(res)
            else:
                ongoing.append(res)

        return GroupedReservations(past=past, ongoing=ongoing, future=future)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
# get ongoing reservations for a room in a hotel
@router.get("/hotel/{hotel_id}/room/{room_id}/ongoing", response_model=List[ReservationResponse])
async def get_ongoing_reservations_for_room(hotel_id: str, room_id: str):
    try:
        today = date.today()
        return await Reservation.find({
            "hotel_id": hotel_id,
            "room_id": room_id,
            "start_date": {"$lte": today},
            "end_date": {"$gte": today}
        }).to_list()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get past reservations for a room in a hotel
@router.get("/hotel/{hotel_id}/room/{room_id}/past", response_model=List[ReservationResponse])
async def get_past_reservations_for_room(hotel_id: str, room_id: str):
    try:
        today = date.today()
        reservations = await Reservation.find({
            "hotel_id": hotel_id,
            "room_id": room_id,
            "end_date": {"$lt": today}
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# get future reservations for a room in a hotel
@router.get("/hotel/{hotel_id}/room/{room_id}/future", response_model=List[ReservationResponse])
async def get_future_reservations_for_room(hotel_id: str, room_id: str):
    try:
        today = date.today()
        reservations = await Reservation.find({
            "hotel_id": hotel_id,
            "room_id": room_id,
            "start_date": {"$gt": today}
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# get all reservations by user
@router.get("/user/{user_id}", response_model=List[ReservationResponse])
async def get_all_reservations_by_user(user_id: str):
    try:
        reservations = await Reservation.find({"user_id": user_id}).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get all reservations by user grouped
@router.get("/user/{user_id}/grouped", response_model=GroupedReservations)
async def get_all_reservations_by_user_grouped(user_id: str):
    try:
        today = date.today()
        all_reservations = await Reservation.find({"user_id": user_id}).to_list()
        populated_reservations = await asyncio.gather(*[populate_reservation(r) for r in all_reservations])

        past = []
        ongoing = []
        future = []

        for res in populated_reservations:
            if res["end_date"] < today:
                past.append(res)
            elif res["start_date"] > today:
                future.append(res)
            else:
                ongoing.append(res)

        return GroupedReservations(past=past, ongoing=ongoing, future=future)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# get ongoing reservations by user
@router.get("/user/{user_id}/ongoing", response_model=List[ReservationResponse])
async def get_ongoing_reservations_by_user(user_id: str):
    try:
        today = date.today()
        reservations = await Reservation.find({
            "user_id": user_id,
            "start_date": {"$lte": today},
            "end_date": {"$gte": today}
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# get past reservations by user
@router.get("/user/{user_id}/past", response_model=List[ReservationResponse])
async def get_past_reservations_by_user(user_id: str):
    try:
        today = date.today()
        reservations = await Reservation.find({
            "user_id": user_id,
            "end_date": {"$lt": today}
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get future reservations by user
@router.get("/user/{user_id}/future", response_model=List[ReservationResponse])
async def get_future_reservations_by_user(user_id: str):
    try:
        today = date.today()
        reservations = await Reservation.find({
            "user_id": user_id,
            "start_date": {"$gt": today}
        }).to_list()
        return await asyncio.gather(*[populate_reservation(r) for r in reservations])
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
