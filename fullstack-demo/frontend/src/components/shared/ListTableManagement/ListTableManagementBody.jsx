import BlueButton from "@/components/buttons/BlueButton";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdToggleOn, MdToggleOff } from "react-icons/md";

const ListTableManagementBody = ({ tableTitle, tableData, headers, buttons, handleItemDelete, handleItemUpdate }) => {
    const width =
        (handleItemDelete || handleItemUpdate ? 2 : 0) +
        ((buttons?.length ? buttons.length : 0))
        * 10
    const widthPercentage = width ? width + 2 : 0
    const widthOfContainer = 100 - widthPercentage
    
    if (tableData && tableData.length === 0) return <div className="flex justify-center">Table '{tableTitle}' is empty...</div>

    return <div className={`mb-6 pr-[1%] pl-[1%]`} style={{ width: `${widthOfContainer}%` }}>
        <h2 className="font-semibold text-lg mb-2 capitalize">{tableTitle.replace('_', ' ')}</h2>

        {/* Table header */}
        <table className="w-full border md:text-sm text-xs table-fixed break-words">
            <thead className="bg-gray-100">
                <tr>
                    {headers.map(({ title }) => (
                        <th key={title} className="p-2 border">{title}</th>
                    ))}
                </tr>
            </thead>
        </table>

        {/* Table rows with delete button outside */}
        <div className="space-y-1">
            {tableData.map((rowData, idx) => (
                <div key={idx} className="relative z-0 flex items-center break-words">
                    <table className="w-full text-sm table-fixed">
                        <tbody>
                            <tr className="text-center">
                                {headers.map(({ property, onClick, toggleIcon }) => (
                                    <td key={property} className="p-2 border">
                                        {toggleIcon ? (
                                            <button
                                                {...(onClick ? { onClick: () => onClick(rowData) } : {})}
                                                className="flex items-center justify-center w-full"
                                            >
                                                {rowData[property] ? (
                                                    <MdToggleOn className={`text-green-500 text-3xl transition-all ${onClick ? 'hover:cursor-pointer hover:text-green-700' : ''}`} />
                                                ) : (
                                                    <MdToggleOff className={`text-gray-400 text-3xl transition-all ${onClick ? 'hover:cursor-pointer hover:text-gray-600' : ''}`} />
                                                )}
                                            </button>
                                        ) : (<>
                                            {(() => {
                                                let cellText = property
                                                    .split('.')
                                                    .reduce((obj, key) => obj?.[key], rowData).toString() || "-";
                                                cellText = cellText.charAt(0).toUpperCase() + cellText.substring(1)

                                                return <span {...(onClick ? { onClick: () => onClick(rowData) } : {})} className={`${onClick ? 'px-3 py-1 rounded-2xl transition-all hover:bg-gray-100 hover:cursor-pointer hover:shadow-2xl' : ''}`}>{cellText}</span>
                                            })()}
                                        </>)}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>

                    {/* Delete icon */}
                    <div className="absolute flex flex-col left-full ml-4" style={{ width: `${width}vw` }}>
                        {buttons && <div className="flex flex-row gap-3">
                            {buttons.map(button => <BlueButton key={button.title} text={button.title} onClick={button.onClick.bind(null, rowData)} extraClasses="text-white text-nowrap overflow-hidden text-[8px] md:text-[11px] lg:text-[14px]" />)}
                        </div>}

                        {handleItemUpdate && <button onClick={() => handleItemUpdate(rowData)}>
                            <FaEdit className="mx-0.5 text-lg transition-all hover:shadow-2xl hover:cursor-pointer text-blue-500 hover:text-blue-700" />
                        </button>}
                        {handleItemDelete && <button onClick={() => handleItemDelete(rowData)}>
                            <FaTrashAlt className="text-lg transition-all hover:shadow-2xl hover:cursor-pointer text-red-500 hover:text-red-700" />
                        </button>}
                    </div>
                </div>
            ))}

            {tableData.length === 0 && (
                <div className="w-full p-2 text-center text-gray-500 border">
                    No data
                </div>
            )}
        </div>
    </div>
}

export default ListTableManagementBody