import GenericButton from "./GenericButton"

const GreenButton = (props) => {
    return <GenericButton
        colorClasses={"bg-green-600 hover:bg-green-700 disabled:bg-green-800"}
        {...props}
    />
}

export default GreenButton