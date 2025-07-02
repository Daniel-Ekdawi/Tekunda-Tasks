import getAllowedLinks from '@/lib/getAllowedLinks';

const getNavbarLinks = (role, clearUser) => {
    const logout = { title: 'Logout', onClick: clearUser };

    const links = [...getAllowedLinks(role)];
    
    const filteredLinks = links.map(link => (link.title === 'Logout' ? logout : link)) 
    
    if (!role) return []

    return filteredLinks
}

export default getNavbarLinks