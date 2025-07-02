import { GUEST_LINKS, HOTEL_ADMIN_LINKS, SUPER_ADMIN_LINKS, VIEWER_LINKS } from "@/constants/NAVBAR_LINKS"

const getAllowedLinks = role => {
        const linksAllowedForRoles = {
        'guest': GUEST_LINKS,
        'viewer': VIEWER_LINKS,
        'hotel_admin': HOTEL_ADMIN_LINKS,
        'super_admin': SUPER_ADMIN_LINKS
    }

    return linksAllowedForRoles[role] || []
}

export default getAllowedLinks