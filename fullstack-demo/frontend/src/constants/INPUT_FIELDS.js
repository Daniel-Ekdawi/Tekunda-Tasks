const checkboxClasses = 'w-4 h-4 accent-green-500 float-end hover:cursor-pointer'

const LOGIN_FIELDS = [
    {
        property: 'email',
        title: "Email",
        required: true,
        type: 'email',
        tag: 'input',
        
    },
    {
        property: 'password',
        title: "Password",
        required: true,
        type: 'password',
        tag: 'input',
        
    },
]

const SIGNUP_FIELDS = [
    {
        property: 'username',
        title: "Username",
        required: true,
        type: 'text',
        tag: 'input',
        
    },
    {
        property: 'email',
        title: "Email",
        required: true,
        type: 'email',
        tag: 'input',
        
    },
    {
        property: 'password',
        title: "Password",
        required: true,
        type: 'password',
        tag: 'input',
        
    },
    {
        property: 'date_of_birth',
        title: "Date of Birth",
        required: true,
        type: 'date',
        tag: 'input',
        
    },
    {
        property: 'gender',
        title: "Gender",
        required: true,
        tag: 'select',
        options: [
            { value: 'M', title: 'Male' },
            { value: 'F', title: 'Female' },
        ],
    },
    {
        property: 'phone_number',
        title: "Phone Number",
        required: true,
        type: 'tel',
        tag: 'input',
        pattern: '^\+?[0-9]{10,15}$',
        
    },
    {
        property: 'job',
        title: "Job",
        required: true,
        type: 'text',
        tag: 'input',
        
    },
    {
        property: 'role',
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
        property: 'name',
        title: "Name",
        required: true,
        type: 'text',
        tag: 'input',
        
    },
    {
        property: 'phone_number',
        title: "Phone Number",
        required: true,
        type: 'tel',
        tag: 'input',
        pattern: '^\+?[0-9]{10,15}$',
        
    },
    {
        property: 'email',
        title: "Email",
        required: true,
        type: 'email',
        tag: 'input',
        
    },
    {
        property: 'swimming_pools',
        title: "Swimming Pools",
        required: true,
        type: 'number',
        tag: 'input',
        
    },
    {
        property: 'max_reservations',
        title: "Max Reservations",
        required: true,
        type: 'number',
        tag: 'input',
        
    },
    {
        property: 'gym',
        title: "Gym",
        type: 'checkbox',
        tag: 'input',
        classes: checkboxClasses,
        
    },
    {
        property: 'spa',
        title: "Spa",
        type: 'checkbox',
        tag: 'input',
        classes: checkboxClasses,
        
    },
    {
        property: 'wifi',
        title: "WiFi",
        type: 'checkbox',
        tag: 'input',
        classes: checkboxClasses,
        
    },
    {
        property: 'parking',
        title: "Parking",
        type: 'checkbox',
        tag: 'input',
        classes: checkboxClasses,
        
    },
]
const ROOM_FIELDS = [
    {
        property: 'number',
        title: "Number",
        required: true,
        type: 'text',
        tag: 'input',
    },
    {
        property: 'price',
        title: "Price",
        required: true,
        type: 'number',
        tag: 'input',
    },
    {
        property: 'description',
        title: "Description",
        required: true,
        type: 'text',
        tag: 'input',
    },
    {
        property: 'type',
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