"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const GreetPage = () => {
    const [showSecret, setShowSecret] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => setShowSecret(false), 3000)
        return () => clearTimeout(timeout)
    }, [showSecret])

    const searchParams = useSearchParams()

    const username = searchParams.get('name')
    const welcomeMessage = username ? <div>Welcome {username}!</div> : <div>Hey there!</div>

    return <div className="mt-[10%] text-5xl flex flex-col gap-12 items-center">
        <div
            className="shadow-2xl animate-bounce bg-cyan-800 text-white rounded-xl p-3 hover:bg-cyan-900 hover:cursor-pointer"
            onClick={() => setShowSecret(oldValue => typeof (oldValue) === 'number' ? oldValue + 1 : 1)}
        >
            {welcomeMessage}
        </div>

        {showSecret && <div
            className="bg-amber-400 rounded-xl p-3 transition-opacity duration-[2900ms] ease-in-out" 
        >
            You found me!
        </div>}
    </div>
}

export default GreetPage