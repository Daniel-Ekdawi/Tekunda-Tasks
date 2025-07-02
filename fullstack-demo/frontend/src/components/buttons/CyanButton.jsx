import GenericButton from "./GenericButton"

const CyanButton = (props) => {
    return <GenericButton
        colorClasses={"bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800"}
        {...props}
    />
}

export default CyanButton