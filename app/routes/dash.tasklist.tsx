import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";

import { createTask, deleteTaskById, getTaskList, toggleTaskCompleted, updateTaskById } from "~/models/task.server";
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

    if (action === "updateTask") {
        const taskId = formData.get("taskId")
        const title = formData.get("title")
        if (typeof taskId != "string" || taskId.length <= 2) {
            return json({ status: 418, message: "Invalid taskId" })
        }
        if (typeof title != "string" || title.length <= 2) {
            return json({ status: 418, message: "Invalid title" })
        }
        const task = await updateTaskById({ id: taskId, title });
        return json({ status: 200, message: `Updated: ${task.id}` })
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
            return json({ status: 200, message: `${!bool ? "Checked" : "Unchecked"} ${task.id}` })
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
    const newTaskBtn = useRef<HTMLButtonElement>(null)

    return (
        <div className="w-full h-screen overflow-y-scroll flex flex-col md:flex-row">

            <div className="w-full p-4">

                <dialog ref={createTaskRef} className="modal">
                    <Form reloadDocument method="post" className="modal-box bg-gray-200 dark:bg-gray-800">
                        <input type="hidden" name="_action" value="createTask" />
                        <h3 className="font-bold text-lg">Create Task</h3>
                        <p className="py-4">Press ESC key or click outside to close</p>

                        <textarea rows={4} name="title" required placeholder="Type here" className="input input-bordered border border-gray-700 bg-transparent w-full h-full py-4" />

                        <button type="submit" className="mt-4 ml-auto px-2 py-1.5 rounded-md bg-green-200 hover:bg-green-300 border border-green-300 text-green-800">Save</button>
                    </Form>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                <div className="w-full inline-flex justify-between items-center">
                    <h1 className="text-3xl mb-4">Tasklist</h1>
                    <button className="border border-gray-700 selection:border-purple-500 px-2 py-1.5 rounded-lg" ref={newTaskBtn} onClick={() => createTaskRef.current?.showModal()}>+&nbsp;New</button>
                </div>

                <div className="w-full flex flex-col gap-2">
                    {data.taskList.filter((task) => !task.completed).map((task, i) => {
                        const editModelRef = useRef<HTMLDialogElement>(null)
                        return (
                            <div key={i} className="relative w-full py-4 px-2 rounded-lg flex flex-col gap-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-700">

                                {/* <div className="absolute top-2 left-2">
                                    <FaExclamationCircle className="text-gray-200 h-6 w-6 opacity-10" />
                                </div> */}

                                <dialog ref={editModelRef} className="modal">
                                    <Form reloadDocument method="post" className="modal-box bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                        <input type="hidden" name="_action" value="updateTask" />
                                        <input type="hidden" name="taskId" value={task.id} />
                                        <h3 className="font-bold text-lg">Edit Task</h3>
                                        <p className="py-4">Press ESC key or click outside to close</p>

                                        <textarea rows={4} name="title" required defaultValue={task.title} className="input input-bordered border border-gray-700 bg-transparent w-full h-full py-4" />

                                        <button type="submit" className="mt-4 ml-auto px-2 py-1.5 rounded-md bg-green-200 hover:bg-green-300 border border-green-300 text-green-800">Save</button>
                                    </Form>
                                    <form method="dialog" className="modal-backdrop">
                                        <button>close</button>
                                    </form>
                                </dialog>

                                <div className="w-full flex flex-col items-start relative p-2 break-words transition-all duration-300 ease-in-out">
                                    <p className={`${task.completed ? "line-through text-gray-600" : "text-gray-800 dark:text-gray-200"} whitespace-pre-line ml-3 leading-5`}>
                                        {task.title}
                                    </p>
                                </div>

                                <div className="ml-auto w-fit h-fit inline-flex gap-2">
                                    <button type="button" onClick={() => editModelRef.current?.showModal()} className="px-2 py-1.5 bg-gray-200 text-gray-700 hover:text-gray-800 border border-gray-300 hover:border-gray-400 ml-auto rounded-xl ease-in-out duration-300">Edit&nbsp;Task</button>
                                    <Form method="post" reloadDocument replace className="ml-auto">
                                        <input type="hidden" name="_action" value="toggleTask" />
                                        <input type="hidden" name="taskId" value={task.id} />
                                        <input type="hidden" name="completed" value={"false"} />
                                        <button type="submit" className="px-2 py-1.5 bg-green-200 text-green-800 border border-green-300 hover:border-green-500 ml-auto rounded-xl ease-in-out duration-300">Mark&nbsp;Complete</button>
                                    </Form>
                                </div>

                                <Form method="post" reloadDocument replace className="absolute top-0 right-0">
                                    <input type="hidden" name="_action" value="removeTask" />
                                    <input type="hidden" name="taskId" value={task.id} />
                                    <button type="submit"><TbTrash className="absolute top-2 right-2 h-6 w-6 bg-red-200 text-red-500 hover:text-red-600 border border-red-300 rounded-full p-1 ease-in-out duration-200" /></button>
                                </Form>
                            </div>
                        )
                    })}
                </div>



                <h1 className="text-3xl my-4">Completed Tasks</h1>

                <div className="w-full">
                    {data.taskList.filter((task) => task.completed).map((task, i) => {
                        return (
                            <div key={i} className="relative w-full p-2 rounded-lg inline-flex mb-2 justify-between lg:col-span-1 bg-gray-200 dark:bg-gray-800 border border-gray-700">

                                <div className="absolute top-2 left-2 bg-transparent">
                                    <BiCheckCircle className="text-gray-600" />
                                </div>

                                <div className="w-full flex flex-col items-start relative p-2 break-words transition-all duration-300 ease-in-out">
                                    <p className={`${task.completed ? "line-through text-gray-600" : "text-gray-200"} whitespace-pre-line ml-3 leading-5`}>
                                        {task.title}
                                    </p>
                                    <Form method="post" reloadDocument className="mt-4 ml-auto">
                                        <input type="hidden" name="_action" value="toggleTask" />
                                        <input type="hidden" name="taskId" value={task.id} />
                                        <input type="hidden" name="completed" value={task.completed.toString()} />
                                        <button type="submit" className="px-2 py-1.5 bg-gray-200 text-gray-700 hover:text-gray-800 border border-gray-300 hover:border-gray-400 ml-auto rounded-xl">reopen</button>
                                    </Form>
                                </div>

                                <Form method="post" reloadDocument replace>
                                    <input type="hidden" name="_action" value="removeTask" />
                                    <input type="hidden" name="taskId" value={task.id} />
                                    <button type="submit"><TbTrash className="absolute top-2 right-2 h-6 w-6 bg-red-200 text-red-500 hover:text-red-600 border border-red-300 rounded-full p-1 ease-in-out duration-200" /></button>
                                </Form>
                            </div>
                        )
                    })}
                </div>
            </div>

            <aside className="bg-transparent border border-gray-800 w-full p-4 flex flex-col gap-4 md:w-80">
                <h1 className="text-xl font-mono text-center">Shortcuts</h1>

                <div className="inline-flex flex-wrap gap-2 break-words justify-center items-center">
                    <div className="border border-gray-700 rounded-lg px-2 py-1.5"><kbd className="kbd kbd-sm bg-gray-800">Shift + N</kbd> Create Task</div>
                </div>
            </aside>


        </div>
    );
}