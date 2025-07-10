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

export { LOGIN_FIELDS, SIGNUP_FIELDS, HOTEL_FIELDS, ROOM_FIELDS }
// Strategy Behavioral Pattern