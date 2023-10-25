import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRef } from "react";
import { BiCheckCircle, BiClipboard, BiMicrophone } from "react-icons/bi";
import { FaBrain, FaSpellCheck, FaMousePointer } from 'react-icons/fa'
import { GrUserAdmin } from 'react-icons/gr'
import { HiUserGroup } from 'react-icons/hi'
import { HiMiniServerStack } from 'react-icons/hi2'
import { TbArrowBounce } from 'react-icons/tb'


// import { PopupForm } from "~/components/PopupForm";
import { getMonthData, getPlausibleStats, getPlausibleTopPages, getPlausibleTopSources } from "~/models/metrics.server";
import { getTaskList } from "~/models/task.server";
import { getUserList } from "~/models/user.server";
import { requireUser } from "~/session.server";
import { secondsToDhms } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const userList = await getUserList();
    const stats = await getPlausibleStats()
    const monthData = (await getMonthData()).results
    const topPages = await getPlausibleTopPages()
    const topSources = await getPlausibleTopSources()
    const taskList = await getTaskList()
    const visitTime = secondsToDhms(stats.results.visit_duration.value)
    const plausibleSharedLink = process.env.PLAUSIBLE_SHARED_LINK || "https://plausible.io/share/byte4byte-remix-starter.fly.dev?auth=KphzHFSWVH9EXTbDDDX3e"
    return { user, plausibleSharedLink, userList, monthData, stats, topPages, topSources, visitTime, taskList }
};

export default function DashboardMetricsPage() {
    const data = useLoaderData<typeof loader>()
    const chartComponentRef = useRef(null);

    // const set1 = Array.from({ length: 31 }, () => Math.floor(Math.random() * 500) + 1).sort((a, b) => a - b);
    const monthData: number[] = []
    data.monthData.map((d) => monthData.push(d.visitors))

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: "#f9fafb",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(55,65,81,0.2)"
        },
        title: {
            text: `${new Date().toLocaleString('default', { month: "long" })} Traffic - byte4byte-remix-starter.fly.dev`,
        },
        credits: {
            enabled: false,
            text: "Data Source - Plausible",
            href: "https://plausible.io/"
        },
        legend: { enabled: true },
        plotOptions: {
            series: {
                step: 'center'
            }
        },
        series: [
            {
                name: "Unique Visitors",
                description: "Desc",
                color: "green",
                type: 'line',
                dataLabels: { enabled: true },
                data: monthData
            },
        ]
    };

    return (
        <div className="w-full max-w-[100vw] h-screen flex flex-col overflow-hidden overflow-y-scroll py-8">

            <div className={`mt-10 w-full max-w-7xl px-2 md:px-8`}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartComponentRef}
                />
            </div>

            <MetricSection />

            <TopPageSection />
            <TopSourcesSection />
            <TaskSection />
            <UserSection />
            <ToolingSection />

        </div>
    );
}

const MetricSection = () => {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full max-w-7xl flex flex-col px-2 md:px-8">
            <div className="w-full my-4 inline-flex justify-start items-center">
                <h1 className="text-3xl">Metrics</h1>
                {/* <Link to="/dash/metrics" className="px-2 py-1.5 text-gray-500 rounded-md border border-gray-300">View&nbsp;More</Link> */}
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
                <div data-tip="Total visitors over last 30 days" className="tooltip tooltip-warning col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-gray-300 hover:border-gray-400 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 hover:shadow-lg">
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

                <div data-tip="Total pageviews over last 30 days" className="tooltip tooltip-warning col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-gray-300 hover:border-gray-400 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 hover:shadow-lg">
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

                <div data-tip="Bounce rate is the percentage of visitors who leave a website after viewing only one page. It indicates how frequently users visit your site without interacting or exploring further." className="tooltip tooltip-warning col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-gray-300 hover:border-gray-400 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 hover:shadow-lg">
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

                <div data-tip="Average time spend on a page" className="tooltip tooltip-warning col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-gray-300 hover:border-gray-400 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>

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
        </div>
    )
}

const TopPageSection = () => {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full max-w-7xl flex flex-col px-2 md:px-8">
            <div className="w-full my-4 flex flex-col justify-start items-start">
                <h1 className="text-3xl">Top Pages - <span className="text-xl text-gray-500">7 days</span></h1>
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
                {data.topPages.results.map((page, i) => {
                    return (
                        <div key={i} className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-800 border border-gray-300 hover:border-gray-400 to-white/5 p-6 shadow-gray-700 rounded-lg ease-in-out duration-300 hover:shadow-lg">
                            <div className="flex flex-row space-x-4 items-center">
                                <div className="text-3xl">
                                    <HiMiniServerStack className='h-8 w-8' />
                                </div>
                                <div>
                                    <p className="text-sm font-mono font-medium uppercase leading-4 bg-blue-300 border border-gray-400 px-2 py-1 rounded-md text-blue-900">{page.page}</p>
                                    <p className="font-bold text-sm inline-flex items-center space-x-2 mt-2">
                                        <span>Unique Visitors: {page.visitors}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const TopSourcesSection = () => {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full max-w-7xl flex flex-col px-2 md:px-8">
            <div className="w-full my-4 flex flex-col justify-start items-start">
                <h1 className="text-3xl">Top Sources</h1>
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
                {data.topSources.results.map((source, i) => {
                    return (
                        <div key={i} className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-800 border border-gray-300 hover:border-gray-400 to-white/5 p-6 shadow-gray-700 rounded-lg ease-in-out duration-300 hover:shadow-lg">
                            <div className="flex flex-row space-x-4 items-center">
                                <div className="text-3xl">
                                    <HiMiniServerStack className='h-8 w-8' />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-mono font-medium uppercase leading-4 bg-blue-300 border border-gray-400 px-2 py-1 rounded-md text-blue-900">{source.source}</p>
                                    <p className="font-bold text-sm inline-flex items-center space-x-2 mt-2">
                                        <span>Bounce Rate: {source.bounce_rate}%</span>
                                    </p>
                                    <p className="font-bold text-sm inline-flex items-center space-x-2 mt-2">
                                        <span>Visitors: {source.visitors}</span>
                                    </p>

                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const TaskSection = () => {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full max-w-7xl flex flex-col px-2 md:px-8">
            <div className="w-full inline-flex my-4 justify-start items-center">
                <h1 className="text-3xl">Task List</h1>
                {/* <Link to="/dash/users" className="px-2 py-1.5 text-gray-500 rounded-md border border-gray-300">View&nbsp;All</Link> */}
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
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
        </div>
    )
}

const UserSection = () => {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full max-w-7xl flex flex-col px-2 md:px-8">
            <div className="w-full my-4 inline-flex justify-between items-center">
                <h1 className="text-3xl">User Management</h1>
                {/* <Link to="/dash/users" className="px-2 py-1.5 text-gray-500 rounded-md border border-gray-300">View&nbsp;All</Link> */}
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
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
        </div>
    )
}

const ToolingSection = () => {
    return (
        <div className="w-full max-w-7xl flex flex-col px-2 md:px-8">
            <div className="w-full my-4 inline-flex justify-between items-center">
                <h1 className="text-3xl">Tools</h1>
            </div>

            <div className="w-full grid grid-cols-4 gap-4">

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
        </div>
    )
}