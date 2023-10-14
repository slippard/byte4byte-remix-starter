import type { LoaderFunctionArgs } from "@remix-run/node"
import { Form, Outlet, useLocation } from '@remix-run/react';
import { useEffect } from "react";
import { BiLogOutCircle } from 'react-icons/bi';

import { getMessageList } from '~/models/contacts.server';
import { requireUser } from '~/session.server';
export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const messageList = await getMessageList()
    return { user, messageList }
};

export default function DashboardIndex() {
    // const data = useLoaderData<typeof loader>()
    const loc = useLocation();
    useEffect(() => {
        console.log(loc)
    }, [])

    return (
        <div>
            <div className="flex bg-gray-100 text-gray-900">

                <aside className="flex h-screen w-20 flex-col items-center border-r border-gray-200 bg-white">
                    <nav className="flex flex-1 flex-col gap-y-4 pt-10">
                        <a href="/" className={`text-gary-400 bg-gray-100 group relative rounded-xl p-2 z-20 hover:scale-105 hover:bg-gray-200 hover:shadow-md ease-in-out duration-300`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>


                            <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                                <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                                    <div className="absolute inset-0 -left-1 flex items-center">
                                        <div className="h-2 w-2 rotate-45 bg-white"></div>
                                    </div>
                                    Home
                                </div>
                            </div>
                        </a>

                        <a href="/dash" className={`${loc.pathname === "/dash" ? "shadow bg-purple-200 text-purple-800 hover:bg-purple-500 hover:text-purple-100" : "text-gary-400 bg-gray-100"}  group relative rounded-xl z-20 p-2 hover:scale-105 hover:bg-gray-200 hover:shadow-md ease-in-out duration-300`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg>

                            <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                                <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                                    <div className="absolute inset-0 -left-1 flex items-center">
                                        <div className="h-2 w-2 rotate-45 bg-white"></div>
                                    </div>
                                    Dashboard
                                </div>
                            </div>
                        </a>

                        <a href="/dash/metrics" className={`${loc.pathname === "/dash/metrics" ? "shadow bg-purple-200 text-purple-800 hover:bg-purple-500 hover:text-purple-100" : "text-gary-400 bg-gray-100"} text-gary-400 bg-gray-100 group relative rounded-xl z-20 p-2 hover:scale-105 hover:bg-gray-200 hover:shadow-md ease-in-out duration-300`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                            </svg>

                            <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                                <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                                    <div className="absolute inset-0 -left-1 flex items-center">
                                        <div className="h-2 w-2 rotate-45 bg-white"></div>
                                    </div>
                                    Metrics
                                </div>
                            </div>
                        </a>

                        <a href="/dash/messages" className={`${loc.pathname === "/dash/messages" ? "shadow bg-purple-200 text-purple-800 hover:bg-purple-500 hover:text-purple-100" : "text-gary-400 bg-gray-100"} text-gary-400 bg-gray-100 group z-20 relative rounded-xl p-2 hover:scale-105 hover:bg-gray-200 hover:shadow-md ease-in-out duration-300`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                            </svg>

                            <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                                <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                                    <div className="absolute inset-0 -left-1 flex items-center">
                                        <div className="h-2 w-2 rotate-45 bg-white"></div>
                                    </div>
                                    Contact&nbsp;Messages
                                </div>
                            </div>
                        </a>

                    </nav>

                    <div className="flex flex-col items-center gap-y-4 py-10">
                        <Form method='post' action='/logout' className='tooltip' data-tip="Logout">
                            <button type="submit"><BiLogOutCircle className='h-8 w-8 text-red-600' /></button>
                        </Form>
                    </div>
                </aside>

                <div className='w-full'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}