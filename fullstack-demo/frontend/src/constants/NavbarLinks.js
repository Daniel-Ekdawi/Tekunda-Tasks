const getNavbarLinks = (user, clearUser) => {
    const role = user?.role

    const guestLinks = ['Login']
    const viewerLinks = ['Profile', 'Logout']
    const hotelAdminLinks = ['Profile', 'Logout']
    const superAdminLinks = ['Profile', 'Users', 'Logout']

    const linksAllowedForRoles = {
        'viewer': viewerLinks,
        'hotel_admin': hotelAdminLinks,
        'super_admin': superAdminLinks
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

    const links = allLinks.filter(link => !role ? guestLinks.includes(link.title) : linksAllowedForRoles[role].includes(link.title))

    return links
}

export { getNavbarLinks }