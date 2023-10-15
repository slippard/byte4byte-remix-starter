import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { BiTrashAlt } from "react-icons/bi";

import { getMessageList } from "~/models/contacts.server";
import { deleteMessageById } from "~/models/main.server";
import { requireUser } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action")

    if (typeof action != "string" || action.length <= 2) {
        return json({ status: 418, message: "Invalid Action" })
    }

    if (action === "delete-message") {
        const messageId = formData.get("messageId")
        if (typeof messageId != "string" || messageId.length <= 2) {
            return json({ status: 418, message: "Invalid messageId" })
        }
        let message = await deleteMessageById(messageId)
        return json({ status: 200, message: `Deleted ${message.id}` })
    }

    return json({ status: 418, message: "Invalid Action" })
};

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
                            <div key={i} className="w-full z-0 mb-4 relative flex flex-col max-w-4xl bg-gray-300 rounded-lg p-4">

                                <div className="absolute top-2 right-2 inline-flex gap-2">
                                    <Form method="post">
                                        <input type="hidden" name="_action" value="delete-message" />
                                        <input type="hidden" name="messageId" value={message.id} />
                                        <button type="submit" className="cursor-pointer">
                                            <BiTrashAlt data-tip="Delete Message" className="tooltip h-6 w-6 text-red-800 bg-gray-200 p-1 rounded-full" />
                                        </button>
                                    </Form>
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