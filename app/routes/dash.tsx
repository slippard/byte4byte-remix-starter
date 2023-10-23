import { json, type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/node"
import { Form, Outlet, useActionData, useLoaderData, useLocation } from '@remix-run/react';
import { useRef } from "react";
import { BiBugAlt, BiError, BiLogOutCircle } from 'react-icons/bi';

import { getMessageList } from '~/models/contacts.server';
import { createBugReport } from "~/models/main.server";
import { requireUser } from '~/session.server';

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action")
    if (typeof action != "string" || action.length <= 2) {
        return json({ status: 418, message: "Invalid Action" })
    }
    if (action === "bug-report") {
        const report = formData.get("report")
        const userId = formData.get("userId")
        if (typeof report != "string" || report.length <= 2) {
            return json({ status: 418, message: "Invalid report" })
        }
        if (typeof userId != "string" || userId.length <= 2) {
            return json({ status: 418, message: "Invalid userId" })
        }
        await createBugReport(userId, report)
        return redirect('/dash/reports')
        // return json({ status: 200, message: `Report filed: ${newReport.id}` })
    }
    return json({ status: 418, message: 'Invalid Action' })
};
export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const messageList = await getMessageList()
    return { user, messageList }
};

export default function DashboardIndex() {
    const actionData = useActionData<typeof action>()
    const data = useLoaderData<typeof loader>()
    const loc = useLocation();
    const bugReportRef = useRef<HTMLDialogElement>(null)

    return (
        <div>
            <div className="flex bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200">

                {actionData?.status === 418 ? <div className="absolute bottom-6 right-4 w-fit inline-flex items-center px-2 py-1.5 gap-8 bg-red-200 border border-red-300 text-red-800 rounded-xl">
                    <BiError />
                    <span>{actionData.message}</span>
                </div> : actionData?.status === 200 ?
                    <div className="absolute bottom-6 right-4 w-fit inline-flex items-center px-2 py-1.5 gap-8 bg-green-200 border border-green-300 text-green-800 rounded-xl">
                        <BiError />
                        <span>{actionData.message}</span>
                    </div> : null
                }

                <aside className="flex h-screen w-20 flex-col items-center border-r border-gray-200 bg-gray-100 dark:bg-gray-700">
                    <nav className="flex flex-1 flex-col gap-y-4 pt-10">
                        
                        <a href="/" className={`text-gary-400 bg-gray-200 dark:bg-gray-900 group relative rounded-xl p-2 z-20 hover:scale-105 hover:bg-gray-200 hover:dark:bg-gray-800 hover:shadow-md ease-in-out duration-300`}>
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

                        <a href="/dash" className={`${loc.pathname === "/dash" ? "shadow bg-purple-200 text-purple-600 hover:bg-purple-300 hover:text-purple-100" : null} bg-gray-200 dark:bg-gray-900 group relative rounded-xl z-20 p-2 hover:scale-105 hover:bg-gray-200 hover:dark:bg-gray-800 hover:shadow-md ease-in-out duration-300`}>
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

                        <a href="/dash/metrics" className={`${loc.pathname === "/dash/metrics" ? "shadow bg-purple-200 text-purple-600 hover:bg-purple-500 hover:text-purple-100" : null} bg-gray-200 dark:bg-gray-900 group relative rounded-xl z-20 p-2 hover:scale-105 hover:bg-gray-200 hover:dark:bg-gray-800 hover:shadow-md ease-in-out duration-300`}>
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

                        <a href="/dash/users" className={`${loc.pathname === "/dash/users" ? "shadow bg-purple-200 text-purple-600 hover:bg-purple-500 hover:text-purple-100" : null} bg-gray-200 dark:bg-gray-900 group relative rounded-xl z-20 p-2 hover:scale-105 hover:bg-gray-200 hover:dark:bg-gray-800 hover:shadow-md ease-in-out duration-300`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>


                            <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                                <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                                    <div className="absolute inset-0 -left-1 flex items-center">
                                        <div className="h-2 w-2 rotate-45 bg-white"></div>
                                    </div>
                                    Users
                                </div>
                            </div>
                        </a>

                        <a href="/dash/tasklist" className={`${loc.pathname === "/dash/tasklist" ? "shadow bg-purple-200 text-purple-600 hover:bg-purple-500 hover:text-purple-100" : null} bg-gray-200 dark:bg-gray-900 group relative rounded-xl z-20 p-2 hover:scale-105 hover:bg-gray-200 hover:dark:bg-gray-800 hover:shadow-md ease-in-out duration-300`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>

                            <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                                <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                                    <div className="absolute inset-0 -left-1 flex items-center">
                                        <div className="h-2 w-2 rotate-45 bg-white"></div>
                                    </div>
                                    Project Tasks
                                </div>
                            </div>
                        </a>

                        <a href="/dash/reports" className={`${loc.pathname === "/dash/reports" ? "shadow bg-purple-200 text-purple-600 hover:bg-purple-500 hover:text-purple-100" : null} bg-gray-200 dark:bg-gray-900 group relative rounded-xl z-20 p-2 hover:scale-105 hover:bg-gray-200 hover:dark:bg-gray-800 hover:shadow-md ease-in-out duration-300`}>
                            <BiBugAlt className="h-6 w-6" />

                            <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                                <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                                    <div className="absolute inset-0 -left-1 flex items-center">
                                        <div className="h-2 w-2 rotate-45 bg-white"></div>
                                    </div>
                                    Bug Reports
                                </div>
                            </div>
                        </a>

                        <a href="/dash/messages?filter=default" className={`${loc.pathname === "/dash/messages" ? "shadow bg-purple-200 text-purple-600 hover:bg-purple-500 hover:text-purple-100" : null} bg-gray-200 dark:bg-gray-900 group relative rounded-xl z-20 p-2 hover:scale-105 hover:bg-gray-200 hover:dark:bg-gray-800 hover:shadow-md ease-in-out duration-300`}>
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
                        {/* <Link className="tooltip" data-tip="Install" to="/install">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Link> */}

                        <dialog ref={bugReportRef} className="modal">
                            <Form method="post" replace reloadDocument className="modal-box bg-gray-100 w-full">
                                <input type="hidden" name="_action" value="bug-report" />
                                <input type="hidden" name="userId" value={data.user.id} />
                                <h3 className="font-bold text-lg mb-4">Bug Report</h3>

                                <textarea name="report" required className="textarea textarea-bordered bg-transparent w-full" placeholder="Describe the bug. What does it look like? How fast is it? 🐞"></textarea>

                                <button type="submit" className="px-4 py-2 rounded-lg mt-2 w-full bg-gray-200 border border-gray-300 hover:border-green-400 hover:bg-green-300 text-gray-800 ease-in-out duration-300">Submit Report</button>

                                <p className="py-4 mx-auto">Press <span className="kbd bg-transparent">ESC</span> key or click outside to close</p>
                            </Form>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>

                        <button type="button" data-tip="Bug Report" className="tooltip tooltip-warning tooltip-right bg-gray-200 p-1 rounded-3xl" onClick={() => bugReportRef.current?.showModal()}><BiBugAlt className="text-orange-400 h-8 w-8" /></button>
                        <Form method='post' action='/logout' className='tooltip tooltip-right tooltip-error' data-tip="Logout">
                            <button type="submit"><BiLogOutCircle className='h-10 w-10 text-red-600 bg-gray-200 rounded-full p-1' /></button>
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