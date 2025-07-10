const handleAPIError = ({ result, response }, expectedStatus) => {
    if (result?.detail) {
        let errorMessage = 'An unknown error occured'
        if (typeof result.detail === 'string') {
            errorMessage = result.detail
        } else if (result.detail instanceof Array) {
            errorMessage = 'These fields are missing: \n'
            result.detail.forEach((entry, index) => {
                errorMessage += `${index + 1}- ${entry.loc[1]}\n`
            })
        }
        throw new Error(errorMessage)
    }

    if (!expectedStatus && !response.ok) throw new Error(result.detail)
    if (expectedStatus && response.status !== expectedStatus) throw new Error(result.detail)

    if (!result || result.error) throw new Error(result?.error || 'An unknown error occured.')
}

export default handleAPIError