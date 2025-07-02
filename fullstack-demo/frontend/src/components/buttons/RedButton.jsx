import GenericButton from "./GenericButton"

const RedButton = (props) => {
    return <GenericButton
        colorClasses={"bg-red-600 hover:bg-red-700 disabled:bg-red-800"}
        {...props}
    />
}

export default RedButton