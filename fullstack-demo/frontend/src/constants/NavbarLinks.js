import { useSession } from "@/components/context/SessionContext"

const getNavbarLinks = () => {
    const { user, clearUser } = useSession()
    const isAuth = Boolean(user)

    const authenticatedLinks = ['Profile']
    const unauthenticatedLinks = ['Login']

    const allLinks = [
        {
            title: 'Profile',
            url: 'profile'
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

    const links = allLinks.filter(link => (isAuth && authenticatedLinks.includes(link.title)) ||
        (!isAuth && unauthenticatedLinks.includes(link.title)) ||
        (!authenticatedLinks.includes(link.title) && !unauthenticatedLinks.includes(link.title))
    )

    return links
}

export { getNavbarLinks }