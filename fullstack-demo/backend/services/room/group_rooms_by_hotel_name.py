import asyncio
from collections import defaultdict
from bson import ObjectId
from beanie.operators import In

from models.hotel import Hotel
from models.room import Room, RoomResponse

async def group_rooms_by_hotel_name(rooms: list[Room]) -> dict[str, list[RoomResponse]]:
    grouped = defaultdict(list)
    for room in rooms:
        grouped[room.hotel_id].append(room)
    hotel_ids = list(grouped.keys())
    hotel_obj_ids = [ObjectId(hid) for hid in hotel_ids]
    hotels = await Hotel.find(In(Hotel.id, hotel_obj_ids)).to_list()
    hotel_id_to_name = {str(hotel.id): hotel.name for hotel in hotels}

    return {
        hotel_id_to_name[hotel_id]: await asyncio.gather(*(room.custom_model_dump() for room in rooms))
        for hotel_id, rooms in grouped.items()
        if hotel_id in hotel_id_to_name
    }
