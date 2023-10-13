import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { BiTrashAlt } from "react-icons/bi";

import { getMessageList } from "~/models/contacts.server";
import { requireUser } from "~/session.server";
export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const messageList = await getMessageList()
    return { user, messageList }
};

export default function DashboardMessages() {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="p-4 flex flex-col gap-4 w-full max-w-5xl mr-auto">
            <h1>All contact form submissions</h1>

            <div className="p-4 bg-gray-200">
                {data.messageList.length >= 1
                    ?
                    data.messageList.map((message, i) => {
                        return (
                            <div key={i} className="w-full z-0 relative flex flex-col max-w-4xl bg-gray-300 rounded-lg p-4">

                                <div className="absolute top-2 right-2 inline-flex gap-2">
                                    <BiTrashAlt data-tip="Delete Message" className="tooltip h-6 w-6 text-red-800 bg-gray-200 p-1 rounded-full" />
                                </div>

                                <div className="inline-flex gap-4">
                                    <p>Name:</p>
                                    <span><p>{message.name}</p></span>
                                </div>
                                <div className="inline-flex gap-4">
                                    <p>Phone:</p>
                                    <span><p>{message.phone}</p></span>
                                </div>
                                <div className="inline-flex gap-4">
                                    <p>Message:</p>
                                    <span><p>{message.message}</p></span>
                                </div>
                            </div>
                        )
                    })
                    :
                    <p>No Saved Messages</p>
                }
            </div>
        </div>
    );
}