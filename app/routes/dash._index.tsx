import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { BiMicrophone } from "react-icons/bi";
import { FaBrain, FaSpellCheck, FaMousePointer } from 'react-icons/fa'
import { GrUserAdmin } from 'react-icons/gr'
import { HiUserGroup } from 'react-icons/hi'
import { MdAccessTimeFilled } from 'react-icons/md'
import { TbArrowBounce } from 'react-icons/tb'

// import { PopupForm } from "~/components/PopupForm";
import { getPlausibleStats } from "~/models/metrics.server";
import { userCountList } from "~/models/user.server";
import { requireUser } from "~/session.server";
// import { useOptionalUser } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const userList = await userCountList();
    const stats = await getPlausibleStats({ site: "byte4byte-remix-starter.fly.dev" })
    const plausibleSharedLink = process.env.PLAUSIBLE_SHARED_LINK || "https://plausible.io/share/byte4byte-remix-starter.fly.dev?auth=KphzHFSWVH9EXTbDDDX3e"
    return { user, plausibleSharedLink, userList, stats }
};

export default function DashboardMetricsPage() {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full h-screen flex flex-col overflow-hidden py-8">
            <h1 className="text-3xl px-8">Metrics</h1>
            <div className="my-4 px-8 py-4 w-full grid grid-cols-4 gap-4">

                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
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

                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
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

                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <MdAccessTimeFilled className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Visit Duration</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.stats.results.visit_duration.value}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="text-3xl">
                            <TbArrowBounce className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Bounce Rate</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.stats.results.bounce_rate.value}</span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <h1 className="px-8 text-3xl">User Management</h1>
            <div className="my-4 px-8 py-4 w-full grid grid-cols-4 gap-4">
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

            <h1 className="px-8 text-3xl">Tools</h1>

            <div className="my-4 px-8 py-4 w-full grid grid-cols-4 gap-4">

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