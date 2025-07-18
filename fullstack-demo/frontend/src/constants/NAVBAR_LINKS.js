const GUEST_LINKS = [
    { title: 'Login', url: 'login' },
    { title: 'Book Now', url: 'booking' },
]

const VIEWER_LINKS = [
    { title: 'Profile', url: 'profile' },
    { title: 'Book Now', url: 'booking' },
    { title: 'My Reservations', url: 'reservation' },
    { title: 'Logout' }
]

const HOTEL_ADMIN_LINKS = [
    { title: 'Profile', url: 'profile' },
    { title: 'Hotels', url: 'manage-hotels' },
    { title: 'Reservations', url: 'reservation' },
    { title: 'Logout' }
]

const SUPER_ADMIN_LINKS = [
    { title: 'Profile', url: 'profile' },
    { title: 'Users', url: 'manage-users' },
    { title: 'Hotels', url: 'manage-hotels' },
    { title: 'Rooms', url: 'manage-rooms' },
    { title: 'Reservations', url: 'reservation' },
    { title: 'Logout' }
]

export { GUEST_LINKS, VIEWER_LINKS, HOTEL_ADMIN_LINKS, SUPER_ADMIN_LINKS }