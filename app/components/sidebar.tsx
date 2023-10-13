import { useState } from 'react'

import { useOptionalUser } from '~/utils'

function SideBar() {
    const user = useOptionalUser()
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className='absolute top-0 inset-x-0'>

            <div className=''>
                <div className="absolute top-4 right-4 z-30">
                    <button className={`${showMenu ? "opacity-0" : "opacity-100"} cursor-pointer ease-in-out duration-300 transition-all`} onClick={() => setShowMenu(!showMenu)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-10 h-10 text-gray-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                <div className={`${showMenu ? "z-40 right-0" : "opacity-0 pointer-events-none z-0 right-0"} absolute bg-transparent transition-all ease-in-out duration-300`}>
                    <div className="relative flex items-center right-0 h-screen w-[400px] bg-gray-100 opacity-90">
                        <button className="absolute top-4 right-4 " onClick={() => setShowMenu(!showMenu)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex flex-col w-full justify-center items-center gap-4 mx-auto px-4">
                            <a className="text-3xl text-gray-800 hover:text-gray-600" onClick={() => setShowMenu(false)} href="/">Home</a>
                            <a className="text-3xl text-gray-800 hover:text-gray-600" onClick={() => setShowMenu(false)} href="/about">About</a>
                            <a className="text-3xl text-gray-800 hover:text-gray-600" onClick={() => setShowMenu(false)} href="/contact">Contact</a>
                            <hr className='w-full max-w-xs h-[2px] bg-gray-400 rounded-xl px-20'/>
                            {user?.id ?
                                <a className="text-3xl text-gray-800 hover:text-gray-600" onClick={() => setShowMenu(false)} href="/dash">Dashboard</a>
                                :
                                <a className="text-3xl text-gray-800 hover:text-gray-600" onClick={() => setShowMenu(false)} href="/login">Login</a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar