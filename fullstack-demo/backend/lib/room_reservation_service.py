from datetime import date
from typing import List

from bson import ObjectId

from models.user import User
from models.hotel import Hotel
from models.room import Room, RoomResponse
from models.reservation import Reservation
from beanie.operators import In

# populate models in reservation
async def populate_reservation(reservation: Reservation) -> Reservation:
    reservation.user = await User.get(reservation.user_id)
    reservation.hotel = await Hotel.get(reservation.hotel_id)
    reservation.room = await Room.get(reservation.room_id)

    return await reservation.custom_model_dump()

# helper function to fetch reserved room IDs within a time range
async def _get_reserved_room_ids(start_date: date, end_date: date, hotel_id: str = None) -> set[str]:
    query = {
        "start_date": {"$lte": end_date},
        "end_date": {"$gte": start_date}
    }
    if hotel_id:
        query["hotel_id"] = hotel_id

    reservations = await Reservation.find(query).to_list()
    return [ObjectId(res.room_id) for res in reservations]

# helper function that returns serialized room lists
async def _serialize_rooms(rooms: List[Room]) -> List[RoomResponse]:
    return [await room.custom_model_dump() for room in rooms]

# get all available rooms in a time period
async def get_all_available_rooms(start_date: date, end_date: date, filters: dict = {}) -> List[Room]:
    reserved_ids = await _get_reserved_room_ids(start_date, end_date)

    room_query = { "_id": {"$nin": reserved_ids} }

    if "type" in filters:
        room_query["type"] = filters["type"]
    if "min_price" in filters:
        room_query["price"] = {**room_query.get("price", {}), "$gte": filters["min_price"]}
    if "max_price" in filters:
        room_query["price"] = {**room_query.get("price", {}), "$lte": filters["max_price"]}

    hotel_filters = {k: True for k in ["wifi", "spa", "gym", "parking"] if filters.get(k)}
    if hotel_filters:
        matched_hotels = await Hotel.find(hotel_filters).to_list()
        matched_hotel_ids = [str(hotel.id) for hotel in matched_hotels]
        if not matched_hotel_ids:
            return []
        room_query["hotel_id"] = {"$in": matched_hotel_ids}

    rooms = await Room.find(room_query).to_list()
    return rooms

# get all unavailable rooms in a time period
async def get_all_unavailable_rooms(start_date: date, end_date: date) -> List[Room]:
    reserved_ids = await _get_reserved_room_ids(start_date, end_date)
    if not reserved_ids:
        return []
    rooms = await Room.find(In(Room.id, reserved_ids)).to_list()
    return rooms

# get all available rooms in a certain hotel in a time period
async def get_all_available_rooms_in_hotel(hotel_id: str, start_date: date, end_date: date) -> List[Room]:
    reserved_ids = await _get_reserved_room_ids(start_date, end_date, hotel_id)
    all_rooms = await Room.find({"hotel_id": hotel_id}).to_list()
    if not reserved_ids:
        return all_rooms
    available_rooms = [room for room in all_rooms if room.id not in reserved_ids]
    return available_rooms

# get all unavailable rooms in a certain hotel in a time period
async def get_all_unavailable_rooms_in_hotel(hotel_id: str, start_date: date, end_date: date) -> List[Room]:
    reserved_ids = await _get_reserved_room_ids(start_date, end_date, hotel_id)
    if not reserved_ids:
        return []
    rooms = await Room.find({"hotel_id": hotel_id}).to_list()
    unavailable_rooms = [room for room in rooms if room.id in reserved_ids]
    return unavailable_rooms