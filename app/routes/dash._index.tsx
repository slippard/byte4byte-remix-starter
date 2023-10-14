import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { HiUserGroup } from 'react-icons/hi'

import { getPlausibleStats } from "~/models/metrics.server";
import { getUserCount } from "~/models/user.server";
import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const userCount = await getUserCount();
    const stats = await getPlausibleStats({ site: "byte4byte-remix-starter.fly.dev" })
    const plausibleSharedLink = process.env.PLAUSIBLE_SHARED_LINK || "https://plausible.io/share/byte4bytesolutions.com?auth=gnuToVkwJt3riCbtGEjmI"
    return { user, plausibleSharedLink, userCount, stats }
};
// https://plausible.io/share/byte4bytesolutions.com?auth=gnuToVkwJt3riCbtGEjmI

export default function DashboardMetricsPage() {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full h-screen flex flex-col overflow-hidden py-8">
            <h1 className="text-3xl px-8">Project Metrics</h1>
            <div className="my-4 px-8 py-4 w-full grid grid-cols-4 gap-4">

                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div id="stats-1">
                            <HiUserGroup className='h-10 w-10' />
                        </div>
                        <div>
                            <p className="text-sm font-mono font-medium uppercase leading-4">Total Users</p>
                            <p className="font-bold text-2xl inline-flex items-center space-x-2">
                                <span>{data.userCount}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-4 sm:col-span-2 lg:col-span-1 bg-blue-200 text-blue-900 border border-blue-300 shadow-blue-300 to-white/5 p-6 rounded-lg ease-in-out duration-300 shadow hover:shadow-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div id="stats-1">
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
                        <div id="stats-1">
                            <HiUserGroup className='h-10 w-10' />
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
                        <div id="stats-1">
                            <HiUserGroup className='h-10 w-10' />
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
                        <div id="stats-1">
                            <HiUserGroup className='h-10 w-10' />
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
        </div>
    );
}