import asyncio
from datetime import date
from beanie.operators import In
from collections import defaultdict
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from lib.enums import RoomType
from lib.room_hotel_service import group_rooms_by_hotel_name
from lib.room_reservation_service import get_all_available_rooms, get_all_available_rooms_in_hotel, get_all_unavailable_rooms, get_all_unavailable_rooms_in_hotel
from models.hotel import Hotel
from models.room import Room, RoomResponse, RoomUpdate, RoomsGroupedByHotelResponse
from pymongo.errors import DuplicateKeyError

router = APIRouter()

# Create Room
@router.post("/{hotel_id}/room", status_code=status.HTTP_201_CREATED, response_model=RoomResponse)
async def create_hotel(room: Room, hotel_id: str):
    try:
        # first check if hotel exists
        hotel = await Hotel.get(hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        
        room.hotel_id = hotel_id
        await room.insert()
        return await room.custom_model_dump(mode="json")
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Room number already exists in this hotel")
    except HTTPException as e:
        raise e 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# Get rooms
@router.get("/all/room", response_model=RoomsGroupedByHotelResponse)
async def get_all_rooms(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    wifi: Optional[bool] = Query(None),
    parking: Optional[bool] = Query(None),
    spa: Optional[bool] = Query(None),
    gym: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    type: Optional[RoomType] = Query(None),
):
    try:
        if (start_date and end_date):
            filters = {
                "wifi": wifi,
                "parking": parking,
                "spa": spa,
                "gym": gym,
                "min_price": min_price,
                "max_price": max_price,
                "type": type
            }
            
            # remove empty filters
            filters = {k: v for k, v in filters.items() if v is not None}

            rooms = await get_all_available_rooms(start_date, end_date, filters)
            return await group_rooms_by_hotel_name(rooms)
        else:
            rooms = await Room.find_all().to_list() 
            return await group_rooms_by_hotel_name(rooms)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# Get rooms for a single hotel
@router.get("/{hotel_id}/room", response_model=RoomsGroupedByHotelResponse)
async def get_all_rooms_for_hotel(hotel_id: str):
    try:
        rooms = await Room.find(Room.hotel_id == hotel_id).to_list()
        return await group_rooms_by_hotel_name(rooms)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# # Get available rooms
# @router.get("/all/room/available", response_model=RoomsGroupedByHotelResponse)
# async def get_available_rooms_all(
#     start_date: date = Query(...),
#     end_date: date = Query(...)
# ):
#     try:
#         rooms = await get_all_available_rooms(start_date, end_date)
#         return await group_rooms_by_hotel_name(rooms)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# # Get unavailable rooms
# @router.get("/all/room/unavailable", response_model=RoomsGroupedByHotelResponse)
# async def get_unavailable_rooms_all(
#     start_date: date = Query(...),
#     end_date: date = Query(...)
# ):
#     try: 
#         rooms = await get_all_unavailable_rooms(start_date, end_date)
#         return await group_rooms_by_hotel_name(rooms)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# # Get available rooms in a certain hotel
# @router.get("/{hotel_id}/room/available", response_model=RoomsGroupedByHotelResponse)
# async def get_available_rooms_in_hotel(
#     hotel_id: str,
#     start_date: date = Query(...),
#     end_date: date = Query(...)
# ):
#     try:
#         rooms = await get_all_available_rooms_in_hotel(hotel_id, start_date, end_date)
#         return await group_rooms_by_hotel_name(rooms)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# # Get unavailable rooms in a certain hotel
# @router.get("/{hotel_id}/room/unavailable", response_model=RoomsGroupedByHotelResponse)
# async def get_unavailable_rooms_in_hotel(
#     hotel_id: str,
#     start_date: date = Query(...),
#     end_date: date = Query(...)
# ):
#     try:
#         rooms = await get_all_unavailable_rooms_in_hotel(hotel_id, start_date, end_date)
#         return await group_rooms_by_hotel_name(rooms)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# Get single room
@router.get("/{hotel_id}/room/{room_id}", response_model=RoomResponse)
async def get_single_room(hotel_id: str, room_id: str):
    try:
        room = await Room.get(room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        if not room.hotel_id == hotel_id:
            raise HTTPException(status_code=404, detail="Room not found in this hotel")
        return await room.custom_model_dump()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# Update a Room
@router.patch("/{hotel_id}/room/{room_id}", response_model=RoomResponse)
async def update_room(hotel_id: str, room_id: str, room_update: RoomUpdate):
    try:
        room_data = room_update.model_dump(exclude_unset=True)
        room_oid = ObjectId(room_id)

        updated_room = await Room.find_one(Room.id == room_oid)

        if not updated_room:
            raise HTTPException(status_code=404, detail="Room not found")

        if not updated_room.hotel_id == hotel_id:
            raise HTTPException(status_code=404, detail="Room not found in this hotel")

        updated_room = await Room.find_one(Room.id == room_oid).update(
            {"$set": room_data},
            response_type=Room
        )

        return await updated_room.custom_model_dump()
    except DuplicateKeyError as e:
        raise HTTPException(status_code=403, detail="Room number for this hotel already exists")
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# Delete a Room
@router.delete("/{hotel_id}/room/{room_id}", response_model=RoomResponse)
async def delete_hotel(hotel_id: str, room_id):
    try:
        room = await Room.get(room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        if not room.hotel_id == hotel_id:
            raise HTTPException(status_code=404, detail="Room not found in this hotel")
        
        await room.delete()
        return await room.custom_model_dump()
    except HTTPException as e:
        raise e    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
