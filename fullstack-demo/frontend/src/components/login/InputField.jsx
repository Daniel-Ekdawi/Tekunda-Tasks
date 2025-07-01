const InputField = ({ title, formData, setFormData }) => {
    const titleLower = title.toLowerCase()
    return <div className="flex items-center gap-3 justify-between">
        <div className="w-[35%]">{title}</div>
        <div className="w-[60%]"><input
            className="text-black bg-gray-100 rounded-xl px-2 py-[1px] w-full"
            type={titleLower === "password" ? titleLower : titleLower === "date of birth" ? "date" : titleLower === "phone number" ? "tel" : "text"}
            onChange={e => setFormData(oldData => ({
                ...oldData,
                [title]: e.target.value
            }))}
            value={formData[title] || ''}
            required
            maxLength={titleLower === 'gender' ? 1 : 40}
            pattern={titleLower === 'phone number' ? "^\+?[0-9]{10,15}$" : ".*"}
        /></div>
    </div>
}

export default InputField