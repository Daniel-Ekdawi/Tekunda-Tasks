"use client"

import { useState, useEffect } from "react";
import ListTableManagementBody from "@/components/shared/ListTableManagement/ListTableManagementBody";
import { useSession } from "@/components/context/SessionContext";
import { useNotification } from "@/components/context/NotificationContext";

const ListTableManagement = ({ tables, setTables, headers, buttons, getTablesFunction, getTablesFunctionDependencies = [], deleteItemFunctionById, handleItemUpdate }) => {
    // tables and setTables are useState variables

    // headers is an array of objects { property, title, ?onClick, ?toggleIcon } 
    // where property is the property extracted from the table data
    // and title is the column header of this property
    // (optional) onClick: function that gets triggered when the property is clicked
    // (optional) toggleIcon: a boolean value, if true then the property is viewed as a toggle button instead of True / False

    // buttons is an array of objects { title, onClick, ?condition }
    // condition is a function taking a row item as a param and returns true if the row should display the button next to it

    // getTablesFunction is a function that returns tables in the form { table1Title: tableData, table2Title: tableData, ... }
    // getTablesFunctionDependencies is a dependency array for the getTablesFunction useEffect

    // deleteItemFunctionById is a function that gets called with the object that needs to be deleted
    // it takes the id of the item to delete

    // handleItemUpdate is a function that gets called when the object needs to be updated

    const { user } = useSession()
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

        if (getTablesFunction) getTables()
        else setIsLoading(false)
    }, getTablesFunctionDependencies)

    const handleItemDelete = async item => {
        const id = item.id
        if (user.id === id) return setMessage({ text: 'Cannot delete own account', type: 'error' }) // for deleting user self account
        const result = await deleteItemFunctionById(id)
        if (!result || result.error) return setMessage({ text: 'Something went wrong...', type: 'error' })
        setTables(oldTablesData => {
            const newTablesData = {}
            Object.entries(oldTablesData).forEach(table => {
                const [tableTitle, tableData] = table
                const newTableData = []
                tableData.forEach(table => {
                    if (table.id !== id) newTableData.push(table)
                })
                newTablesData[tableTitle] = newTableData
            })
            setMessage({ text: `Successfully deleted ${result.name || (result.username ? `user ${result.username}` : undefined) || (result.number ? `room ${result.number}` : undefined)}!`, type: 'success' })
            return newTablesData
        })
    }

    return (<>
        {(() => {
            if (isLoading) return "Loading..."

            const entries = Object.entries(tables || {})
            const nonEmpty = entries.filter(([, data]) => data?.length)

            return nonEmpty.length ?
                nonEmpty.map(([tableTitle, tableData]) => <ListTableManagementBody key={tableTitle} tableTitle={tableTitle} tableData={tableData} headers={headers} buttons={buttons} handleItemDelete={deleteItemFunctionById ? handleItemDelete : undefined} handleItemUpdate={handleItemUpdate} />) :
                "There is no data..."
        })()}
    </>)
}

export default ListTableManagement