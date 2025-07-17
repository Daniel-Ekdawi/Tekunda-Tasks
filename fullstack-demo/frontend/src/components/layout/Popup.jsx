'use client'

import { usePopup } from '@/components/context/PopupContext'
import OverlayModal from '@/components/wrappers/OverlayModal'
import { useEffect, useState } from 'react'

const Popup = () => {
    const { popupComponent, popupClasses, clearPopup } = usePopup()
    const [isOpen, setIsOpen] = useState(!!popupComponent)

    useEffect(() => {
        setIsOpen(!!popupComponent)
    }, [popupComponent])

    const handleClose = () => {
        setIsOpen(false)
        clearPopup()
    }

    return (
        <OverlayModal
            isOpen={isOpen}
            setIsOpen={handleClose}
            orientation='items-center justify-start'
            translation='translate-y-20'
            background='bg-black/10 backdrop-blur-xs'
            z='z-40'
        >
            <div className={`bg-white rounded-lg p-6 min-w-[200px] ${popupClasses}`}>
                {popupComponent}
            </div>
        </OverlayModal>
    )
}

export default Popup