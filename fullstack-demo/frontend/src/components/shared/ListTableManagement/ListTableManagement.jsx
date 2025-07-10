"use client"

import { useState, useEffect } from "react";
import ListTableManagementBody from "@/components/shared/ListTableManagement/ListTableManagementBody";
import { useSession } from "@/components/context/SessionContext";
import { useNotification } from "@/components/context/NotificationContext";

const ListTableManagement = ({ tables, setTables, headers, getTablesFunction, deleteItemFunction, handleItemUpdate }) => {
    // tables and setTables are useState variables

    // headers is an array of objects { property, title } 
    // where property is the property extracted from the table data
    // and title is the column header of this property
    // (optional) onClick: function that gets triggered when the property is clicked
    // (optional) toggleIcon: a boolean value, if true then the property is viewed as a toggle button instead of True / False

    // getTablesFunction is a function that returns tables in the form { table1Title: tableData, table2Title: tableData, ... }

    // deleteItemFunction is a function that gets called with the object that needs to be deleted
    // it takes the id of the item to delete

    // handleItemUpdate is a function that gets called when the object needs to be updated

    const { user }= useSession()
    const { setMessage } = useNotification()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getTables = async () => {
            setIsLoading(true)
            const result = await getTablesFunction()
            setIsLoading(false)
            if (!result || result.error) return setMessage({ text: result?.error || 'An error occured while fetching data', type: 'error' })
            setTables(result)
        }

        getTables()
    }, [])

    const handleItemDelete = async item => {
        const id = item._id
        if (user.id === id) return setMessage({ text: 'Cannot delete own account', type: 'error' }) // for deleting user self account
        const result = await deleteItemFunction(id)
        if (!result || result.error) return setMessage({ text: 'Something went wrong...', type: 'error' })
        setTables(oldTablesData => {
            const newTablesData = {}
            Object.entries(oldTablesData).forEach(table => {
                const [tableTitle, tableData] = table
                const newTableData = []
                tableData.forEach(table => {
                    if (table._id !== id) newTableData.push(table)
                })
                newTablesData[tableTitle] = newTableData
            })
            return newTablesData
        })
    }
    return (<>
        {isLoading && "Loading..."}
        {!isLoading && tables && Object.keys(tables).length > 0 && <div>
            {tables && Object.entries(tables).map(([tableTitle, tableData]) => <ListTableManagementBody key={tableTitle} tableTitle={tableTitle} tableData={tableData} headers={headers} handleItemDelete={deleteItemFunction ? handleItemDelete : undefined} handleItemUpdate={handleItemUpdate} />)}
        </div>}
        {!isLoading && tables && Object.keys(tables).length === 0 && "There is no data..."}
    </>)
}

export default ListTableManagement