const GUEST_LINKS = [
    { title: 'Login', url: 'login' }
]

const VIEWER_LINKS = [
    { title: 'Profile', url: 'profile' },
    { title: 'Logout' }
]

const HOTEL_ADMIN_LINKS = [
    { title: 'Profile', url: 'profile' },
    { title: 'Hotels', url: 'manage-hotels' },
    { title: 'Logout' }
]

const SUPER_ADMIN_LINKS = [
    { title: 'Profile', url: 'profile' },
    { title: 'Rooms', url: 'manage-rooms' },
    { title: 'Hotels', url: 'manage-hotels' },
    { title: 'Users', url: 'manage-users' },
    { title: 'Logout' }
]

export { GUEST_LINKS, VIEWER_LINKS, HOTEL_ADMIN_LINKS, SUPER_ADMIN_LINKS }