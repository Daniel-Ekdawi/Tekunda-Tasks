from enum import Enum

class UserRole(str, Enum):
    viewer = "viewer"
    hotel_admin = "hotel_admin"
    super_admin = "super_admin"