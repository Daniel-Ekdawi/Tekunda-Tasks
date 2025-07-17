import React from "react";

const BoolComponent = ({ title, property, value, handleChange }) => <label className="flex items-center justify-center gap-2 flex-1 min-w-[120px]">
    <input
        type="checkbox"
        checked={!!value}
        onChange={e => handleChange(property, e.target.checked)}
    />
    {title}
</label>

const SelectComponent = ({ title, property, value, options, handleChange }) => <label className="flex flex-col flex-1 min-w-[120px]">
    <span className="mb-1 font-medium">{title}</span>
    <select
        className="border px-2 py-1 rounded"
        value={value}
        onChange={e => handleChange(property, e.target.value)}
    >
        <option value="">Any</option>
        {options.map(option => (
            <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
        ))}
    </select>
</label>

const DefaultComponent = ({ title, property, value, type, handleChange }) => <label className="flex flex-col flex-1 min-w-[120px]">
    <span className="mb-1 font-medium">{title}</span>
    <input
        type={type}
        className="border px-2 py-1 rounded"
        value={value}
        onChange={e => handleChange(property, e.target.value)}
    />
</label>


const BookingSearchForm = ({ filters, setFilters }) => {
    const handleChange = (property, value) => setFilters(prev => {
        const updated = { ...prev }
        if (value === "" || value === null || value === undefined || value === false) delete updated[property]
        else updated[property] = value;
        return updated;
    })

    const filterFields = [
        [
            { title: "Start Date", property: "start_date", type: "date" },
            { title: "End Date", property: "end_date", type: "date" }
        ],
        [
            { title: "Has WiFi", property: "wifi", type: "bool" },
            { title: "Has Parking", property: "parking", type: "bool" },
            { title: "Has Spa", property: "spa", type: "bool" },
            { title: "Has Gym", property: "gym", type: "bool" }
        ],
        [
            { title: "Min Price", property: "min_price", type: "number" },
            { title: "Max Price", property: "max_price", type: "number" },
            { title: "Room Type", property: "type", type: "select", options: ["single", "double"] }
        ],
    ]

    return <form className="space-y-4 bg-white p-4 rounded shadow w-[60%]">
        {filterFields.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap gap-4">
                {row.map(({ title, property, type, options = [] }) => {
                    const value = filters?.[property] ?? ""

                    if (type === "bool") return <BoolComponent key={property} title={title} property={property} value={value} handleChange={handleChange} />

                    if (type === "select") return <SelectComponent key={property} title={title} property={property} options={options} value={value} handleChange={handleChange} />

                    return <DefaultComponent key={property} title={title} property={property} value={value} type={type} handleChange={handleChange} />
                })}
            </div>
        ))}
    </form>
}

export default BookingSearchForm;