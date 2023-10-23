import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { BiTrashAlt } from "react-icons/bi";
import { BsEnvelopePlus } from "react-icons/bs";
import { LiaEnvelopeOpenTextSolid } from "react-icons/lia";

import { getMessageList } from "~/models/contacts.server";
import { deleteMessageById, getHoneyPotList, markMessageSpam, restoreMessage } from "~/models/main.server";
import { requireUser } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action")

    if (typeof action != "string" || action.length <= 2) {
        return json({ status: 418, message: "Invalid Action" })
    }

    if (action === "mark-spam") {
        const messageId = formData.get("messageId")
        if (typeof messageId != "string" || messageId.length <= 2) {
            return json({ status: 418, message: "Invalid messageId" })
        }
        await markMessageSpam({ id: messageId })
        return json({ status: 200, message: `Marked Spam` })
    }

    if (action === "restore-message") {
        const messageId = formData.get("messageId")
        if (typeof messageId != "string" || messageId.length <= 2) {
            return json({ status: 418, message: "Invalid messageId" })
        }
        await restoreMessage({ id: messageId })
        return json({ status: 200, message: `Restored Message` })
    }

    if (action === "delete-message") {
        const messageId = formData.get("messageId")
        if (typeof messageId != "string" || messageId.length <= 2) {
            return json({ status: 418, message: "Invalid messageId" })
        }
        await deleteMessageById(messageId)
        return json({ status: 200, message: `Message Deleted` })
    }

    return json({ status: 418, message: "Invalid Action" })
};

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const honey = await getHoneyPotList()
    const messageList = await getMessageList()
    return { user, messageList, honey }
};

export default function DashboardMessages() {
    const data = useLoaderData<typeof loader>()
    const [searchParams, setSearchParams] = useSearchParams("default");
    const [searchStyles, setSearchStyles] = useState(searchParams.get("filter"))

    useEffect(() => {
        switch (searchStyles) {
            case "default":
                setSearchStyles("bg-purple-500 hover:bg-purple-600 text-purple-100 hover:text-purple-50")
                break;
            case "Wedding Photography":
                setSearchStyles("bg-purple-500 hover:bg-purple-600 text-purple-100 hover:text-purple-50")
                break;
            case "Portrait Photography":
                setSearchStyles("bg-purple-500 hover:bg-purple-600 text-purple-100 hover:text-purple-50")
                break;
            case "honeypot":
                setSearchStyles("bg-purple-500 hover:bg-purple-600 text-purple-100 hover:text-purple-50")
                break;
            default:
                setSearchStyles("bg-purple-500 hover:bg-purple-600 text-purple-100 hover:text-purple-50")
                break;
        }
    }, [searchStyles])

    return (
        <div className="h-screen p-4 flex flex-col w-full mr-auto">
            <div className="p-4">
                <h1 className="text-3xl font-mono mt-6 mb-2">Form Submissions</h1>

                <div className="block">
                    <nav className="flex flex-col md:flex-row gap-2" aria-label="Tabs">
                        <button
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set("filter", "default");
                                setSearchParams(params);
                            }}
                            className={`${searchParams.get("filter") === "default" ? "bg-purple-600 text-purple-200" : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"} shrink-0 rounded-lg p-2 text-sm font-medium`}
                            aria-current="page"
                        >
                            All
                        </button>

                        <button
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set("filter", "honeypot");
                                setSearchParams(params);
                            }}
                            className={`${searchParams.get("filter") === "honeypot" ? 'bg-yellow-500 text-gray-950' : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"} shrink-0 rounded-lg p-2 text-sm font-medium`}
                        >
                            Honey Pot
                        </button>

                    </nav>
                </div>
            </div>

            <div className="p-4 grid grid-cols-12 gap-4 rounded-xl">
                {data.messageList.length >= 1
                    ?
                    (searchParams.get("filter") === "default") ?
                        <>
                            {data.messageList.map((message, i) => {
                                return (
                                    <div key={i} className="w-full col-span-12 md:col-span-6 xl:col-span-4 z-0 mb-4 relative flex flex-col bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 h-fit">

                                        <div className="absolute top-2 right-2 inline-flex gap-2">
                                            <Form method="post">
                                                <input type="hidden" name="_action" value="mark-spam" />
                                                <input type="hidden" name="messageId" value={message.id} />
                                                <button type="submit" data-tip="Mark Spam" className="tooltip cursor-pointer">
                                                    <LiaEnvelopeOpenTextSolid className="h-8 w-8 text-orange-500 bg-gray-200 dark:bg-gray-800 p-1 rounded-full border border-gray-300 dark:border-gray-700 ease-in-out duration-200" />
                                                </button>
                                            </Form>

                                            <Form method="post">
                                                <input type="hidden" name="_action" value="delete-message" />
                                                <input type="hidden" name="messageId" value={message.id} />
                                                <button type="submit" data-tip="Delete Message" className="tooltip cursor-pointer">
                                                    <BiTrashAlt className="h-8 w-8 text-red-400 bg-gray-200 dark:bg-gray-800 p-1 rounded-full border border-gray-300 dark:border-gray-700 ease-in-out duration-200" />
                                                </button>
                                            </Form>
                                        </div>

                                        <div
                                            className={`${message.origin === "default" ? "bg-purple-700 text-purple-200 border border-purple-600" : message.origin === "Wedding Photography" ? "bg-green-700 text-green-200 border border-green-600" : message.origin === "Portrait Photography" ? "bg-orange-700 text-orange-200 border border-orange-600" : null} rounded-lg px-2 w-fit mb-2`}>
                                            {message.origin === "default" ? "Main Contact" : message.origin === "Wedding Photography" ? "Wedding Photography" : message.origin === "Portrait Photography" ? "Portrait Photography" : null}
                                        </div>
                                        <div className="inline-flex gap-4">
                                            <p>Name:</p>
                                            <span>{message.name}</span>
                                        </div>
                                        <div className="inline-flex gap-4">
                                            <p>Phone:</p>
                                            <span>{message.phone}</span>
                                        </div>
                                        <div className="inline-flex gap-4">
                                            <p>Message:</p>
                                            <span>{message.message}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                        :
                        searchParams.get("filter") === "honeypot" ?
                            <>
                                {data.honey.map((message, i) => {
                                    return (
                                        <div key={i} className="w-full col-span-12 md:col-span-6 xl:col-span-4 z-0 mb-4 relative flex flex-col bg-gray-700 border border-gray-600 rounded-xl p-4 h-fit">

                                            <div className="absolute top-2 right-2 inline-flex gap-2">
                                                <Form method="post">
                                                    <input type="hidden" name="_action" value="restore-message" />
                                                    <input type="hidden" name="messageId" value={message.id} />
                                                    <button type="submit" data-tip="Restore Message" className="tooltip cursor-pointer">
                                                        <BsEnvelopePlus className="h-8 w-8 text-orange-500 bg-gray-200 dark:bg-gray-800 p-1 rounded-full border border-gray-600 ease-in-out duration-200" />
                                                    </button>
                                                </Form>

                                                <Form method="post">
                                                    <input type="hidden" name="_action" value="delete-message" />
                                                    <input type="hidden" name="messageId" value={message.id} />
                                                    <button type="submit" data-tip="Delete Message" className="tooltip cursor-pointer">
                                                        <BiTrashAlt className="h-8 w-8 text-red-400 bg-gray-200 dark:bg-gray-800 p-1 rounded-full border border-gray-600 ease-in-out duration-200" />
                                                    </button>
                                                </Form>
                                            </div>

                                            <div
                                                className={`${message.origin === "default" ? "bg-yellow-700 text-yellow-200 border border-yellow-600" : message.origin === "Wedding Photography" ? "bg-yellow-700 text-yellow-200 border border-yellow-600" : message.origin === "Portrait Photography" ? "bg-orange-700 text-orange-200 border border-orange-600" : null} rounded-lg px-2 w-fit mb-2`}>
                                                Spam
                                            </div>
                                            <div className="inline-flex gap-4">
                                                <p>Name:</p>
                                                <span>{message.name}</span>
                                            </div>
                                            <div className="inline-flex gap-4">
                                                <p>Phone:</p>
                                                <span>{message.phone}</span>
                                            </div>
                                            <div className="inline-flex gap-4">
                                                <p>Message:</p>
                                                <span>{message.message}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                            :
                            <>
                                {data.messageList.filter(message => message.origin === searchParams.get("filter")).map((message, i) => {
                                    return (
                                        <div key={i} className="w-full col-span-12 md:col-span-6 xl:col-span-4 z-0 mb-4 relative flex flex-col bg-gray-700 border border-gray-600 rounded-xl p-4 h-fit">

                                            <div className="absolute top-2 right-2 inline-flex gap-2">
                                                <Form method="post">
                                                    <input type="hidden" name="_action" value="mark-spam" />
                                                    <input type="hidden" name="messageId" value={message.id} />
                                                    <button type="submit" data-tip="Mark Spam" className="tooltip cursor-pointer">
                                                        <LiaEnvelopeOpenTextSolid className="h-8 w-8 text-orange-500 bg-gray-800 hover:bg-gray-900 p-1 rounded-full border border-gray-600 ease-in-out duration-200" />
                                                    </button>
                                                </Form>

                                                <Form method="post">
                                                    <input type="hidden" name="_action" value="delete-message" />
                                                    <input type="hidden" name="messageId" value={message.id} />
                                                    <button type="submit" data-tip="Delete Message" className="tooltip cursor-pointer">
                                                        <BiTrashAlt className="h-8 w-8 text-red-400 bg-gray-800 hover:bg-gray-900 p-1 rounded-full border border-gray-600 ease-in-out duration-200" />
                                                    </button>
                                                </Form>
                                            </div>

                                            <div
                                                className={`${message.origin === "default" ? "bg-purple-700 text-purple-200 border border-purple-600" : message.origin === "Wedding Photography" ? "bg-green-700 text-green-200 border border-green-600" : message.origin === "Portrait Photography" ? "bg-orange-700 text-orange-200 border border-orange-600" : null} rounded-lg px-2 w-fit mb-2`}>
                                                {message.origin === "default" ? "Main Contact" : message.origin === "Wedding Photography" ? "Wedding Photography" : message.origin === "Portrait Photography" ? "Portrait Photography" : null}
                                            </div>
                                            <div className="inline-flex gap-4">
                                                <p>Name:</p>
                                                <span>{message.name}</span>
                                            </div>
                                            <div className="inline-flex gap-4">
                                                <p>Phone:</p>
                                                <span>{message.phone}</span>
                                            </div>
                                            <div className="inline-flex gap-4">
                                                <p>Message:</p>
                                                <span>{message.message}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                    :
                    <p>No Saved Messages</p>
                }
            </div>
        </div>
    );
}