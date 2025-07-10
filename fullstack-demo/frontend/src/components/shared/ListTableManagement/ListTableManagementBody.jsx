import { useSession } from "@/components/context/SessionContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdToggleOn, MdToggleOff } from "react-icons/md";

const ListTableManagementBody = ({ tableTitle, tableData, headers, handleItemDelete, handleItemUpdate }) => {
    const { user } = useSession()
    
    return <div className="mb-6 pr-9 pl-4">
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
                <div key={idx} className="relative flex items-center break-words">
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
                                                    <MdToggleOn className={`text-green-500 text-3xl transition-all ${user.role === 'hotel_admin' ? 'hover:cursor-pointer hover:text-green-700' : ''}`} />
                                                ) : (
                                                    <MdToggleOff className={`text-gray-400 text-3xl transition-all ${user.role === 'hotel_admin' ? 'hover:cursor-pointer hover:text-gray-600' : ''}`} />
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
                    <div className="absolute flex flex-col left-full ml-2">
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