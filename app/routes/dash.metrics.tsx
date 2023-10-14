import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";

import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const plausibleSharedLink = process.env.PLAUSIBLE_SHARED_LINK || "https://plausible.io/share/byte4byte-remix-starter.fly.dev?auth=KphzHFSWVH9EXTbDDDX3e"
    return { user, plausibleSharedLink }
};

export default function DashboardMetrics() {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="w-full h-screen overflow-hidden">
            <iframe title="metrics" src={`${data.plausibleSharedLink}&embed=true&theme=light`} loading="eager" className="w-full min-h-screen h-full "></iframe>
            <script async src="https://plausible.io/js/embed.host.js"></script>
        </div>
    );
}

// https://languagetool.org/