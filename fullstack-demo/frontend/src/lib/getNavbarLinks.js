import { GUEST_LINKS, HOTEL_ADMIN_LINKS, SUPER_ADMIN_LINKS, VIEWER_LINKS } from "@/constants/NAVBAR_LINKS"

const getNavbarLinks = (role, clearUser) => {
    const linksAllowedForRoles = {
        'viewer': VIEWER_LINKS,
        'hotel_admin': HOTEL_ADMIN_LINKS,
        'super_admin': SUPER_ADMIN_LINKS
    }

    const allLinks = [
        {
            title: 'Profile',
            url: 'profile'
        },
        {
            title: 'Users',
            url: 'users'
        },
        {
            title: 'Login',
            url: 'login'
        },
        {
            title: 'Logout',
            onClick: () => clearUser()
        }
    ]

    if (!role) return []

    const links = allLinks.filter(link => role === 'guest' ? GUEST_LINKS.includes(link.title) : linksAllowedForRoles[role].includes(link.title))

    return links
}

export { getNavbarLinks }