import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { BiCheckCircle, BiClipboard, BiMicrophone } from "react-icons/bi";
import { FaBrain, FaSpellCheck, FaMousePointer } from 'react-icons/fa'
import { GrUserAdmin } from 'react-icons/gr'
import { HiUserGroup } from 'react-icons/hi'
import { MdAccessTimeFilled, MdWarning } from 'react-icons/md'
import { TbArrowBounce } from 'react-icons/tb'

// import { PopupForm } from "~/components/PopupForm";
import { getPlausibleStats } from "~/models/metrics.server";
import { getTaskList } from "~/models/task.server";
import { getUserList } from "~/models/user.server";
import { requireUser } from "~/session.server";
import { secondsToDhms } from "~/utils";
// import { useOptionalUser } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const userList = await getUserList();
    const stats = await getPlausibleStats({ site: "byte4byte-remix-starter.fly.dev" })
    const taskList = await getTaskList()
    const visitTime = secondsToDhms(stats.results.visit_duration.value)
    const plausibleSharedLink = process.env.PLAUSIBLE_SHARED_LINK || "https://plausible.io/share/byte4byte-remix-starter.fly.dev?auth=KphzHFSWVH9EXTbDDDX3e"
    return { user, plausibleSharedLink, userList, stats, visitTime, taskList }
};

export default function DashboardMetricsPage() {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full h-screen flex flex-col overflow-hidden overflow-y-scroll py-8">

            <div className="w-full px-8 max-w-7xl">
                <div className="w-full grid grid-cols-12 items-center px-4 py-2 gap-4 bg-yellow-200 border border-yellow-300 rounded-lg">
                    <MdWarning className="col-span-1 text-yellow-900 h-6 w-6" />
                    <p className="text-yellow-900 col-span-11">This is a live demo to showcase the current features of the apps. As features are added, bugs may be introduced. If you run into an error, try refreshing the page, or report a bug.</p>
                </div>
            </div>

            <div className="w-full my-4 inline-flex justify-start items-center px-8 max-w-7xl">
                <h1 className="text-3xl">Metrics</h1>
                {/* <Link to="/dash/metrics" className="px-2 py-1.5 text-gray-500 rounded-md border border-gray-300">View&nbsp;More</Link> */}
            </div>

            <div className="px-8 w-full grid grid-cols-4 gap-4 max-w-7xl">
                <div data-tip="Total visitors over last 30 days" className="tooltip tooltip-warning col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <HiUserGroup className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Visitors</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.stats.results.visitors.value}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div data-tip="Total pageviews over last 30 days" className="tooltip tooltip-warning col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <FaMousePointer />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Pageviews</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.stats.results.pageviews.value}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div data-tip="Bounce rate is the percentage of visitors who leave a website after viewing only one page. It indicates how frequently users visit your site without interacting or exploring further." className="tooltip tooltip-warning col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <TbArrowBounce className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Bounce Rate</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.stats.results.bounce_rate.value}%</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div data-tip="Average time spend on a page" className="tooltip tooltip-warning col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <MdAccessTimeFilled className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Visit Duration</p>
                            <p className="font-bold text-xl inline-flex items-center space-x-2">
                                <span>{data.visitTime}</span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="w-full inline-flex my-4 justify-start items-center px-8 max-w-7xl">
                <h1 className="text-3xl">Task List</h1>
                {/* <Link to="/dash/users" className="px-2 py-1.5 text-gray-500 rounded-md border border-gray-300">View&nbsp;All</Link> */}
            </div>

            <div className="px-8 w-full grid grid-cols-4 gap-4">
                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-purple-200 text-purple-900 border border-purple-300 shadow-purple-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <BiClipboard className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Total Tasks</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.taskList.length}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-purple-200 text-purple-900 border border-purple-300 shadow-purple-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <BiCheckCircle className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Completed</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.taskList.filter((task) => task.completed).length}/{data.taskList.length}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full inline-flex my-4 justify-start items-center px-8 max-w-7xl">
                <h1 className="text-3xl">User Management</h1>
                {/* <Link to="/dash/users" className="px-2 py-1.5 text-gray-500 rounded-md border border-gray-300">View&nbsp;All</Link> */}
            </div>

            <div className="px-8 w-full grid grid-cols-4 gap-4">
                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-green-200 text-green-900 border border-green-300 shadow-green-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <HiUserGroup className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Total Users</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.userList.length}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-green-200 text-green-900 border border-green-300 shadow-green-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <GrUserAdmin className='text-green-700' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Admin Users</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.userList.filter((user) => user.admin).length}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full my-4 inline-flex justify-between items-center px-8 max-w-7xl">
                <h1 className="text-3xl">Tools</h1>
            </div>

            <div className="px-8 w-full grid grid-cols-4 gap-4 max-w-7xl">

                <a href="https://languagetool.org/" target="_blank" rel="noreferrer" className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <FaSpellCheck />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Grammer & Spell Check</p>
                        </div>
                    </div>
                </a>

                <a href="https://llava.hliu.cc/" target="_blank" rel="noreferrer" className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            🌋
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">LLaVA Language & Vision Assistant</p>
                        </div>
                    </div>
                </a>

                <a href="https://talknotes.io/" target="_blank" rel="noreferrer" className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <BiMicrophone />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Talk Notes</p>
                        </div>
                    </div>
                </a>

                <a href="https://claude.ai/chats" target="_blank" rel="noreferrer" className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <FaBrain />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Claude AI</p>
                        </div>
                    </div>
                </a>

            </div>

            {/* <PopupForm
                content={<PopupContents />}
                title="Sample Form"
                action="demotest"
                buttonTitle="Test Button"
                buttonStyles="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            /> */}

        </div>
    );
}

/* const PopupContents = () => {
    const user = useOptionalUser()
    return (
        <div>
            <input type="hidden" name="userId" value={user?.id} />

            <div className="form-control w-full">
                <input type="text" required name="message" placeholder="Describe your issue here" className="input input-bordered w-full" />
            </div>
        </div>
    )
} */