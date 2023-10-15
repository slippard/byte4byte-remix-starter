import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { TbTrash } from "react-icons/tb";

import { createTask, deleteTaskById, getTaskList, toggleTaskCompleted } from "~/models/task.server";
import { requireUser } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action")

    if (typeof action != "string" || action.length <= 2) {
        return json({ status: 418, message: "Invalid Action" })
    }

    if (action === "createTask") {
        const title = formData.get("title")
        if (typeof title != "string" || title.length <= 2) {
            return json({ status: 418, message: "Invalid title" })
        }
        const task = await createTask(title);
        return json({ status: 200, message: `created ${task.id}` })
    }

    if (action === "toggleTask") {
        const taskId = formData.get("taskId")
        const completed = formData.get("completed")
        if (typeof taskId != "string" || taskId.length <= 2) {
            return json({ status: 418, message: "Invalid taskId" })
        }
        if (typeof completed != "string") {
            return json({ status: 418, message: "Invalid completed" })
        }
        console.log(`Got: ${completed}`)
        const bool = completed === "true" ? true : completed === "false" ? false : completed
        if (typeof bool != "boolean") {
            return json({ status: 200, message: `Could not toggle` })
        } else {
            console.log("Toggled")
            const task = await toggleTaskCompleted(!bool, taskId)
            return json({ status: 200, message: `Toggled ${task.id}` })
        }
    }

    if (action === "removeTask") {
        const taskId = formData.get("taskId")

        if (typeof taskId != "string" || taskId.length <= 2) {
            return json({ status: 418, message: "Invalid taskId" })
        }

        const task = await deleteTaskById(taskId)
        return json({ status: 200, message: `Removed ${task.id}` })
    }

    return json({ status: 418, message: "Invalid Action" })
};
export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const taskList = await getTaskList()
    return { user, taskList }
};

export default function DashboardTasklist() {
    const createTaskRef = useRef<HTMLDialogElement>(null)
    const data = useLoaderData<typeof loader>()

    return (
        <div className="w-full max-w-7xl p-8">

            <dialog ref={createTaskRef} className="modal">
                <Form reloadDocument method="post" className="modal-box bg-gray-200">
                    <input type="hidden" name="_action" value="createTask" />
                    <h3 className="font-bold text-lg">Create Task</h3>
                    <p className="py-4">Press ESC key or click outside to close</p>

                    <textarea rows={4} name="title" required placeholder="Type here" className="input input-bordered bg-transparent w-full h-full py-4" />

                    <button type="submit" className="mt-4 ml-auto px-2 py-1.5 rounded-md bg-green-200 hover:bg-green-300 border border-green-300 text-green-800">Save</button>
                </Form>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <div className="w-full inline-flex justify-between items-center">
                <h1 className="text-3xl mb-4">Tasklist</h1>
                <button className="" onClick={() => createTaskRef.current?.showModal()}>+&nbsp;New</button>
            </div>

            <div className="w-full">
                {data.taskList.map((task, i) => {
                    const createFormRef = useRef<HTMLFormElement>(null)
                    const submit = useSubmit();
                    const [selected, setSelected] = useState(task.completed)
                    return (
                        <div key={i} className="w-full p-2 rounded-lg inline-flex mb-2 content-center items-center justify-between lg:col-span-1 bg-gray-200">
                            <div className="flex items-center">
                                <Form reloadDocument className="h-full" ref={createFormRef} onChange={(e) => submit(e.currentTarget)} method="post">
                                    <input type="hidden" name="_action" value="toggleTask" />
                                    <input type="hidden" name="taskId" value={task.id} />
                                    <input type="hidden" name="completed" value={selected.toString()} />
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            setSelected(e.target.checked)
                                        }}
                                        defaultChecked={selected}
                                        className="checkbox checkbox-success" />
                                </Form>

                            </div>

                            <div className="w-full flex items-start relative p-2 break-words">
                                <p className={`${task.completed && "line-through"} ml-3 leading-5 text-gray-600`}>
                                    {task.title}
                                </p>

                            </div>

                            <Form method="post" reloadDocument className="flex items-center justify-center cursor-pointer">
                                <input type="hidden" name="_action" value="removeTask" />
                                <input type="hidden" name="taskId" value={task.id} />
                                <button type="submit"><TbTrash className="h-4 w-4 text-red-500" /></button>
                            </Form>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}