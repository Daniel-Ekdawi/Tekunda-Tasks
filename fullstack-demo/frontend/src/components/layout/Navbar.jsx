"use client";

import { useState } from "react";
import Link from "next/link";
import logo from '/public/layout/navbar/logo.png'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getNavbarLinks } from "@/constants/NavbarLinks";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter()

    const navbarLinks = getNavbarLinks()

    return (
        <nav className={
            "fixed z-50 top-0 left-0 w-full flex flex-col items-center backdrop-blur-md bg-black/40 brightness-90 text-white border-b border-white/20 px-[5%] md:px-0 lg:px-[5%] overflow-visible shadow-md" +
            (isOpen ? " rounded-b-lg" : "")
        }>
            <div className="w-full flex flex-1 flex-nowrap items-center justify-between p-4 md:px-8">
                {/* Logo */}
                <div className="flex items-center text-white space-x-4 md:space-x-2 lg:space-x-6">
                    <Image className="hover:cursor-pointer hover:brightness-80 transition duration-200 hover:shadow-lg rounded-[50%]" src={logo} height={36} width={36} alt="BookAway Logo" onClick={() => router.push("/")} />
                    <span className="text-lg lg:text-2xl font-semibold whitespace-nowrap dark:text-white hover:cursor-pointer hover:brightness-80 transition duration-200 hover:shadow-lg" onClick={() => router.push("/")}>
                        BookAway
                    </span>
                </div>

                {/* Search Bar (Desktop) */}
                {/* <div className="relative hidden md:block basis-[15%] md:basis-[25%] lg:basis-[30%]">
                    <CustomNavbarSearchBar />
                </div> */}

                {/* Navbar Links (Visible on Desktop) */}
                <div className="hidden md:flex text-white justify-end">
                    {navbarLinks.map(link =>
                        <span key={link.url || link.title} className="px-[0.5vw] dark:text-white hover:text-gray-200 dark:hover:text-gray-300 whitespace-nowrap hover:cursor-pointer">
                            {link?.url && <Link href={link.url}>{link.title}</Link>}
                            {link?.onClick && <span onClick={link.onClick}>{link.title}</span>}
                        </span>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 w-10 h-10 text-white rounded-lg hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
                    aria-controls="navbar-menu"
                    aria-expanded={isOpen}
                >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`${isOpen ? "block" : "hidden"} w-full md:hidden mb-3 mx-3`}>
                <ul className="flex flex-col text-center p-4 py-2 border border-gray-100 rounded-lg bg-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    {navbarLinks.map((link, index) => <li key={link.url || link.title} className={`border-b border-gray-300 dark:border-gray-700 ${index === navbarLinks.length - 1 ? 'border-b-0' : ''}`}>
                        <span onClick={() => setIsOpen(false)} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                            {link?.url && <Link href={link.url}>{link.title}</Link>}
                            {link?.onClick && <span onClick={link.onClick}>{link.title}</span>}                            
                        </span>
                    </li>)}
                </ul>
            </div>
        </nav >
    );
}

export default Navbar