const GenericButton = ({ text, colorClasses, onClick, disabled, extraClasses }) => {
    return <button
        className={`${colorClasses} transition-all hover:cursor-pointer shadow-2xl rounded-xl px-1 md:px-2 lg:px-3 py-1 w-full ${extraClasses}`}
        onClick={onClick}
        disabled={disabled}
    >{text}</button>

}

export default GenericButton