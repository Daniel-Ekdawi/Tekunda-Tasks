'use client'
import { createContext, useContext, useState } from 'react'

const PopupContext = createContext()

export const PopupProvider = ({ children }) => {
    const [popupComponent, setPopupComponent] = useState(null)
    const [popupClasses, setPopupClasses] = useState()

    const setPopup = ({ component, popupClasses }) => {
        setPopupComponent(component)
        setPopupClasses(popupClasses)
    }

    const clearPopup = () => {
        setPopupComponent(null)
        setPopupClasses()
    }

    return (
        <PopupContext.Provider value={{ setPopup, clearPopup, popupComponent, popupClasses }}>
            {children}
        </PopupContext.Provider>
    )
}

export const usePopup = () => useContext(PopupContext)