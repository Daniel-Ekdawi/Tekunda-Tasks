from datetime import date
from typing import List

from bson import ObjectId

from models.hotel import Hotel
from models.room import Room
from models.reservation import Reservation
from beanie.operators import In

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

# builds room query
async def _build_room_query(room_query = {}, filters: dict = {}):
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
    return room_query


# get all available rooms in a time period
async def get_all_available_rooms(start_date: date, end_date: date, filters: dict = {}) -> List[Room]:
    reserved_ids = await _get_reserved_room_ids(start_date, end_date)
    room_query = { "_id": {"$nin": reserved_ids} }
    room_query = await _build_room_query(room_query, filters)
    rooms = await Room.find(room_query).to_list()
    return rooms

# get all unavailable rooms in a time period
async def get_all_unavailable_rooms(start_date: date, end_date: date, filters: dict = {}) -> List[Room]:
    reserved_ids = await _get_reserved_room_ids(start_date, end_date)
    if not reserved_ids:
        return []
    room_query = {"_id": {"$in": reserved_ids}}
    room_query = await _build_room_query(room_query, filters)
    rooms = await Room.find(room_query).to_list()
    return rooms

# get all available rooms in a certain hotel in a time period
async def get_all_available_rooms_in_hotel(hotel_id: str, start_date: date, end_date: date, filters: dict = {}) -> List[Room]:
    reserved_ids = await _get_reserved_room_ids(start_date, end_date, hotel_id)
    room_query = {"hotel_id": hotel_id}
    if reserved_ids: room_query["_id"] = {"$nin": reserved_ids}
    room_query = await _build_room_query(room_query, filters)
    return await Room.find(room_query).to_list()

# get all unavailable rooms in a certain hotel in a time period
async def get_all_unavailable_rooms_in_hotel(hotel_id: str, start_date: date, end_date: date, filters: dict = {}) -> List[Room]:
    reserved_ids = await _get_reserved_room_ids(start_date, end_date, hotel_id)
    if not reserved_ids: return []
    room_query = { "hotel_id": hotel_id, "_id": {"$in": reserved_ids} }
    room_query = await _build_room_query(room_query, filters)
    return await Room.find(room_query).to_list()