from enum import Enum

class UserRole(str, Enum):
    VIEWER = "viewer"
    HOTEL_ADMIN = "hotel_admin"
    SUPER_ADMIN = "super_admin"

class RoomType(str, Enum):
    SINGLE = "single"
    DOUBLE = "double"

class ReservationStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    CANCELLED = "cancelled"