import getAllowedLinks from '@/lib/getAllowedLinks';

const getNavbarLinks = (role, clearUser) => {
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

    const links = allLinks.filter(link => getAllowedLinks(role).includes(link.title))

    return links
}

export default getNavbarLinks