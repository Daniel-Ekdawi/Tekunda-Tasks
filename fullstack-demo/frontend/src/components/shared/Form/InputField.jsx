const InputField = ({ field, formData, setFormData }) => {
    if (!field) return null
    const title = field.title
    const titleLower = title.toLowerCase()
    const handleChange = event => setFormData(oldData => ({ ...oldData, [title]: (field.type === 'checkbox' ? event.target.checked : event.target.value) }))
    const defaultInputClasses = "text-black bg-gray-100 rounded-xl px-2 py-[1px] w-full"

    const inputComponent = <input
        className={field.classes || defaultInputClasses}
        type={field.type}
        onChange={handleChange}
        checked={formData[title] || false}
        value={formData[title] || ''}
        required={field.required}
        maxLength={field.maxLength || 40}
        pattern={field.pattern || ".*"}
    />

    const selectComponent = <select
        className={field.classes || defaultInputClasses}
        onChange={handleChange}
        value={formData[title] || ''}
        required={field.required}
    >
        <option value="" disabled>Select {titleLower}</option>
        {field.options && field.options.map(option => <option key={option.value} value={option.value}>{option.title}</option> )}
    </select>

    return <div className="flex items-center gap-3 justify-between">
        <div className="w-[35%]">{title}</div>
        <div className="w-[60%]">
            {field.tag === 'select' && selectComponent}
            {field.tag === 'input' && inputComponent}
        </div>
    </div>
}

export default InputField