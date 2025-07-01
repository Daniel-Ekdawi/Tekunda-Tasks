"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useNotification } from "@/components/context/NotificationContext"

import InputField from "@/components/login/InputField"
import GreenButton from "@/components/buttons/GreenButton"

import { login, signup } from "@/api/login"
import { LOGIN_FIELDS, SIGNUP_FIELDS } from "@/constants/InputFields"
import { useSession } from "@/components/context/SessionContext"

const LoginPage = () => {
    const { setMessage } = useNotification()
    const { setUser } = useSession()
    const router = useRouter()

    const [formData, setFormData] = useState({})
    const [loginMode, setLoginMode] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ text: 'Loading...', type: 'warning' })
        if (loginMode) await handleLogin()
        else await handleSignup()
        setIsLoading(false)
    }

    const handleLogin = async () => {
        const result = await login(formData)
        if (result?.error) return setMessage({ text: result.error || 'Login failed!', type: 'error' }) // error

        setUser(result)
        setMessage({ text: `Welcome back, ${result.user.username}!`, type: 'success' }) // success
        router.push('profile') // redirect
    }

    const handleSignup = async () => {
        const result = await signup(formData)
        if (result?.error) return setMessage({ text: result.error || 'Signup failed!', type: 'error' }) // error
        
        setUser(result)
        setMessage({ text: 'Successfully created an account!', type: 'success' }) // success
        router.push('profile') // redirect
    }

    return (<div className="flex flex-col items-center">
        <form className="flex flex-col gap-3 bg-gray-600 p-4 rounded-xl text-white mt-[10%]" onSubmit={handleSubmit}>
            <div className="text-4xl text-center mt-2 mb-6">{loginMode ? "Login" : "Signup"}</div>
            {loginMode && LOGIN_FIELDS.map(loginField => <InputField key={loginField} title={loginField} formData={formData} setFormData={setFormData} />)}
            {!loginMode && SIGNUP_FIELDS.map(signupField => <InputField key={signupField} title={signupField} formData={formData} setFormData={setFormData} />)}
            <div className="my-2 hover:text-gray-300 hover:cursor-pointer hover:underline" onClick={() => setLoginMode(currentMode => !currentMode)}>
                {loginMode ? "Don't have an account yet? Sign up now!" : "Already have an account? Login now!"}
            </div>
            <GreenButton text={loginMode ? "Login" : "Signup"} disabled={isLoading || !(loginMode ? LOGIN_FIELDS : SIGNUP_FIELDS).every(field => formData[field]?.trim())} type="submit" />
        </form>
    </div>)
}

export default LoginPage