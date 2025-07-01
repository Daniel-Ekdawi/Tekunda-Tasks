import { COOKIE_USER_KEY } from "@/constants/StorageKeys";
import Cookies from "js-cookie";

const COOKIE_EXPIRES_MINUTES = 60;
const COOKIE_EXPIRES_DAYS = COOKIE_EXPIRES_MINUTES / (24 * 60);

const cookieOptions = {
    sameSite: "Lax",
    expires: COOKIE_EXPIRES_DAYS,
};

// get user from cookies
const getUser = () => {
    const user = Cookies.get(COOKIE_USER_KEY);
    return user ? JSON.parse(user) : null;
};

// set user in cookies
const setSession = ({ user }) => Cookies.set(COOKIE_USER_KEY, JSON.stringify(user), cookieOptions)

// clear user and token from cookies
const logout = () => Cookies.remove(COOKIE_USER_KEY)

// check if user is logged in
const isAuth = () => !!getUser()

export { getUser, setSession, logout, isAuth };