import asyncio
from datetime import date
from typing import List, Literal, Optional, Union

from models.reservation import GroupedReservations, Reservation, ReservationResponse
from services.reservation.populate_reservation import populate_reservation


async def get_reservations_options(query: dict = {}, options: Optional[Literal["grouped", "ongoing", "past", "future"]] = None) -> Union[List[ReservationResponse], GroupedReservations]:
    today = date.today()
    if options == "ongoing": query.update({"start_date": {"$lte": today}, "end_date": {"$gte": today}})
    elif options == "past": query["end_date"] = {"$lt": today}
    elif options == "future": query["start_date"] = {"$gt": today}

    reservations = await Reservation.find(query).to_list()
    populated_reservations = await asyncio.gather(*(populate_reservation(r) for r in reservations))

    if options == "grouped":
        past, ongoing, future = [], [], []
        for reservation in populated_reservations:
            (past if reservation["end_date"] < today else future if reservation["start_date"] > today else ongoing).append(reservation)
        return GroupedReservations(past=past, ongoing=ongoing, future=future)

    return populated_reservations
