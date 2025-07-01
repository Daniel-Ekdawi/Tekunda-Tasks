import GenericButton from "./GenericButton"

const BlackButton = (props) => {
    return <GenericButton
        colorClasses={"bg-black hover:bg-gray-900 disabled:bg-gray-800"}
        {...props}
    />
}

export default BlackButton