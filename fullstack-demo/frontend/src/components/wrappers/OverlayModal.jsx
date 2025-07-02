const OverlayModal = ({ children, isOpen, setIsOpen, orientation = 'items-center justify-center', translation = '', background = 'bg-black bg-opacity-50', z = '30', overlayClick = '' }) => {
    const outerContainerClasses = 'fixed inset-0 flex flex-col p-4 ' + orientation + ' ' + background + ' z-' + z  + ' ' + overlayClick
    const innerContainerClasses = 'flex flex-col items-end pointer-events-auto ' + translation
    const closeButtonClasses = 'translate-y-8 -translate-x-4 text-gray-500 hover:text-gray-700'

    const handleClose = () => setIsOpen(false)

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const WrapperComponent = <div className={outerContainerClasses} onClick={background ? handleOverlayClick : () => { }}>
        <div className={innerContainerClasses}>
            <button className={closeButtonClasses} onClick={handleClose} aria-label="Close">&times;</button>
            {children}
        </div>
    </div>

    if (!isOpen) return null; // modal is closed

    return WrapperComponent
}

export default OverlayModal