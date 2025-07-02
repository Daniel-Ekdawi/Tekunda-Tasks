import GenericButton from "./GenericButton"

const OrangeButton = (props) => {
    return <GenericButton
        colorClasses={"bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800"}
        {...props}
    />
}

export default OrangeButton