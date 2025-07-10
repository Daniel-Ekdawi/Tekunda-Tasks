const checkboxClasses = 'w-4 h-4 accent-green-500 float-end hover:cursor-pointer'

const LOGIN_FIELDS = [
    {
        title: "Email",
        required: true,
        type: 'email',
        tag: 'input',
        
    },
    {
        title: "Password",
        required: true,
        type: 'password',
        tag: 'input',
        
    },
]

const SIGNUP_FIELDS = [
    {
        title: "Username",
        required: true,
        type: 'text',
        tag: 'input',
        
    },
    {
        title: "Email",
        required: true,
        type: 'email',
        tag: 'input',
        
    },
    {
        title: "Password",
        required: true,
        type: 'password',
        tag: 'input',
        
    },
    {
        title: "Date of Birth",
        required: true,
        type: 'date',
        tag: 'input',
        
    },
    {
        title: "Gender",
        required: true,
        type: 'text',
        tag: 'input',
        maxLength: 1,
        
    },
    {
        title: "Phone Number",
        required: true,
        type: 'tel',
        tag: 'input',
        pattern: '^\+?[0-9]{10,15}$',
        
    },
    {
        title: "Job",
        required: true,
        type: 'text',
        tag: 'input',
        
    },
    {
        title: "Role",
        required: true,
        tag: 'select',
        options: [
            { value: 'viewer', title: 'Viewer' },
            { value: 'hotel_admin', title: 'Hotel Admin' },
        ],
        
    },
]

const HOTEL_FIELDS = [
    {
        title: "Name",
        required: true,
        type: 'text',
        tag: 'input',
        
    },
    {
        title: "Phone Number",
        required: true,
        type: 'tel',
        tag: 'input',
        pattern: '^\+?[0-9]{10,15}$',
        
    },
    {
        title: "Email",
        required: true,
        type: 'email',
        tag: 'input',
        
    },
    {
        title: "Swimming Pools",
        required: true,
        type: 'number',
        tag: 'input',
        
    },
    {
        title: "Max Reservations",
        required: true,
        type: 'number',
        tag: 'input',
        
    },
    {
        title: "Gym",
        type: 'checkbox',
        tag: 'input',
        classes: checkboxClasses,
        
    },
    {
        title: "Spa",
        type: 'checkbox',
        tag: 'input',
        classes: checkboxClasses,
        
    },
    {
        title: "WiFi",
        type: 'checkbox',
        tag: 'input',
        classes: checkboxClasses,
        
    },
    {
        title: "Parking",
        type: 'checkbox',
        tag: 'input',
        classes: checkboxClasses,
        
    },
]
const ROOM_FIELDS = [
    {
        title: "Number",
        required: true,
        type: 'text',
        tag: 'input',
    },
    {
        title: "Price",
        required: true,
        type: 'number',
        tag: 'input',
    },
    {
        title: "Description",
        required: true,
        type: 'text',
        tag: 'input',
    },
    {
        title: "Type",
        required: true,
        tag: 'select',
        options: [
            { value: 'single', title: 'Single' },
            { value: 'double', title: 'Double' },
        ],
    },
]

export { LOGIN_FIELDS, SIGNUP_FIELDS, HOTEL_FIELDS, ROOM_FIELDS }
// Strategy Behavioral Pattern