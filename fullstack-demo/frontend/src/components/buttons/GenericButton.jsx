const GenericButton = ({ text, colorClasses, onClick, disabled }) => {
    return <button
        className={`${colorClasses} transition-all hover:cursor-pointer shadow-2xl rounded-xl px-3 py-1 w-full`}
        onClick={onClick}
        disabled={disabled}
    >{text}</button>

}

export default GenericButton