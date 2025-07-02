"use client"

import { useEffect, useState } from 'react';
import OverlayModal from '@/components/wrappers/OverlayModal';
import { useNotification } from '@/components/context/NotificationContext'

const Notification = () => { // message is in form { text: '', type: 'error'/'success'/'warning' }
    const { message } = useNotification()
    const [isOpen, setIsOpen] = useState(message?.text)

    const outerContainerClasses = 'text-white p-2 rounded-lg pl-4 pr-12 whitespace-pre-line ' +
        (message?.type === 'error' ? 'bg-red-600 ' : '') +
        (message?.type === 'warning' ? 'bg-yellow-600 ' : '') +
        (message?.type === 'success' ? 'bg-green-600 ' : '')

    useEffect(() => {
        if (message?.text) {
            setIsOpen(true)
            const closeTimeout = setTimeout(() => {
                setIsOpen(false)
            }, 3000)

            return () => {
                clearTimeout(closeTimeout)
            }
        }
    }, [message])

    const NotificationComponent = <div className={outerContainerClasses}>{message?.text}</div>

    return (<OverlayModal isOpen={isOpen} setIsOpen={setIsOpen} orientation='items-start justify-start' translation='translate-x-2 translate-y-12' background='bg-transparent' z='40' overlayClick='pointer-events-none'>
        {NotificationComponent}
    </OverlayModal>)
}

export default Notification