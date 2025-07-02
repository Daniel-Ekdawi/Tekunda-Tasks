import GenericButton from "./GenericButton"

const YellowButton = (props) => {
    return <GenericButton
        colorClasses={"bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-700"}
        {...props}
    />
}

export default YellowButton