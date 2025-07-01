import GenericButton from "./GenericButton"

const BlueButton = (props) => {
    return <GenericButton
        colorClasses={"bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800"}
        {...props}
    />
}

export default BlueButton