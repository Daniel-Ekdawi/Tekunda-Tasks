const CardWrapper = ({ children }) => {
    return (
        <div className="grid gap-3 p-4 border border-gray-300 rounded-lg bg-gray-100 w-full">
            {children}
        </div>
    );
};

export default CardWrapper;