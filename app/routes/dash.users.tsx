import { json, type LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"
import { useLoaderData, Form } from "@remix-run/react";
import { useRef, useState } from 'react'
import { BiCog } from "react-icons/bi";

import { createUser, deleteUserByEmail, getUserById, updateUserEmailById, updateUserPasswordById, userCountList } from "~/models/user.server";
import { requireUser } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action")

    if (typeof action != "string" || action.length <= 2) {
        return json({ status: 418, message: "Invalid Action" })
    }

    if (action === "register-user") {
        const email = formData.get("email")
        const password = formData.get("password")
        if (typeof email != "string" || email.length <= 2) {
            return json({ status: 418, message: "Invalid email" })
        }
        if (typeof password != "string" || password.length <= 2) {
            return json({ status: 418, message: "Invalid password" })
        }
        const user = await createUser(email, password)
        return json({ status: 200, message: `${user.email} has been created` })
    }

    if (action === "update-email") {
        const userId = formData.get("userId")
        const email = formData.get("email")

        if (typeof userId != "string" || userId.length <= 2) {
            return json({ status: 418, message: "Invalid userId" })
        }

        if (typeof email != "string" || email.length <= 2) {
            return json({ status: 418, message: "Invalid email" })
        }

        const user = await updateUserEmailById(userId, email);
        return json({ status: 200, message: `Updated ${user.email}` })
    }

    if (action === "update-password") {
        const userId = formData.get("userId")
        const password = formData.get("password")

        if (typeof userId != "string" || userId.length <= 2) {
            return json({ status: 418, message: "Invalid userId" })
        }

        if (typeof password != "string" || password.length <= 2) {
            return json({ status: 418, message: "Invalid password" })
        }

        const user = await updateUserPasswordById(userId, password);
        return json({ status: 200, message: `Updated ${user.email} password` })
    }

    if (action === 'delete-user') {
        const userId = formData.get("userId")
        if (typeof userId != "string" || userId.length <= 2) {
            return json({ status: 418, message: "Invalid userId" })
        }
        const user = await getUserById(userId)

        if (user?.id) {
            await deleteUserByEmail(user?.email)
            return json({ status: 200, message: `${user.email} has been removed` })
        } else {
            return json({ status: 418, message: "Could not delete user" })
        }
    }

    return json({ status: 418, message: "Something happened" })
};

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const userList = await userCountList()
    return { user, userList }
};

/* interface UserType {
    id: string;
    email: string;
    admin: boolean;
    createdAt: string;
    updatedAt: string;
} */

export default function DashboardUsersPage() {
    const data = useLoaderData<typeof loader>()
    const newUserModal = useRef<HTMLDialogElement>(null)
    const [showPass, setShowPass] = useState(false)
    return (
        <div className="w-full max-w-7xl grid grid-cols-12 p-8">

            <dialog ref={newUserModal} className="modal">
                <Form method="post" reloadDocument className="modal-box flex flex-col gap-4 bg-gray-200 border border-gray-300">
                    <input type="hidden" name="_action" value="register-user" />
                    <h3 className="font-bold text-lg">Register User</h3>
                    <p className="pb-4 text-xs">Press ESC key or click outside to close</p>

                    <input type="email" name="email" required placeholder="Type email here" className="input input-bordered bg-transparent w-full" />

                    <div className="inline-flex items-center">
                        <input type={showPass ? "text" : "password"} name="password" required placeholder="Enter password" className="input input-bordered bg-transparent w-full" />
                        {showPass ?
                            <svg onClick={() => setShowPass(!showPass)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-2 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            :
                            <svg onClick={() => setShowPass(!showPass)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-2 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        }

                    </div>

                    <button type="submit" className="bg-green-200 hover:bg-green-300 border border-green-300 text-green-800 rounded-lg w-fit mx-auto px-2 py-1.5 ease-in-out duration-300">Create User</button>
                </Form>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <div className="w-fit ml-auto col-span-12 mb-2">
                <button onClick={() => newUserModal.current?.show()} className="px-2 py-1.5 rounded-md bg-green-200 hover:bg-green-300 border border-green-300 text-green-800">+ Create</button>
            </div>
            <div className="overflow-x-auto col-span-12">
                <table className="table table-xs border border-gray-400 rounded-lg">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Created at</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.userList.map((user, i) => {
                            return (
                                <tr key={i} className='bg-gray-200 hover:bg-gray-300'>
                                    <th>{i + 1}</th>
                                    <td>{user.email}</td>
                                    <td>{user.admin ? "Administrator" : "Standard"}</td>
                                    <td>{new Date(user.createdAt).toDateString()}</td>
                                    <td>
                                        <ActionModal
                                            title={`Manage ${user.email}`}
                                            content={() => {
                                                return (
                                                    <div className="flex flex-col gap-2">
                                                        <Form method="post" className="p-2 rounded-lg bg-gray-100 shadow-md border border-gray-300">
                                                            <input type="hidden" name="_action" value="update-email" />
                                                            <input type="hidden" name="userId" value={user.id} />

                                                            <input type="email" name="email" defaultValue={user.email} placeholder="Type here" className="mb-2 input input-bordered bg-transparent w-full" />

                                                            <button type="submit" className='w-full px-4 py-2 rounded-md bg-green-200 border border-green-300 text-green-800 hover:bg-green-300 ease-in-out duration-300'>Update Email</button>
                                                        </Form>

                                                        <Form method="post" className="p-2 rounded-lg bg-gray-100 shadow-md border border-gray-300">
                                                            <input type="hidden" name="_action" value="update-password" />
                                                            <input type="hidden" name="userId" value={user.id} />

                                                            <input type="password" name="password" placeholder="Enter new password" className="mb-2 input input-bordered bg-transparent w-full" />

                                                            <button type="submit" className='w-full px-4 py-2 rounded-md bg-green-200 border border-green-300 text-green-800 hover:bg-green-300 ease-in-out duration-300'>Update Password</button>
                                                        </Form>

                                                        <Form method="post" className="p-2 rounded-lg bg-gray-100 shadow-md border border-gray-300">
                                                            <input type="hidden" name="_action" value="delete-user" />
                                                            <input type="hidden" name="userId" value={user.id} />
                                                            <button type="submit" className='w-full px-4 py-2 rounded-md bg-red-200 text-red-800 hover:bg-red-300 ease-in-out duration-300'>Delete User</button>
                                                        </Form>
                                                    </div>
                                                )
                                            }} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Created at</th>
                            <th>Actions</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

const ActionModal = ({ content, title }: { title: string, content: () => JSX.Element }) => {
    const modalRef = useRef<HTMLDialogElement>(null)
    return (
        <>
            <button className="px-2 py-1.5" onClick={() => modalRef.current?.showModal()}>
                <BiCog className="h-4 w-4" />
            </button>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box w-fit bg-gray-200">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="pb-4">Press ESC key or click outside to close</p>
                    <div className='w-full'>
                        {content()}
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

/* const RemoveUserModal = ({ buttonTitle, buttonStyles, content }: { content: JSX.Element, buttonStyles: React.ComponentProps<'div'>['className'], buttonTitle: string }) => {
    const [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <div className="flex">
                <button
                    type="button"
                    onClick={openModal}
                    className={` ${buttonStyles}`}
                >
                    {buttonTitle}
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Remove User
                                    </Dialog.Title>
                                    <Form method='post'>
                                        <input type="hidden" name="_action" value="remove-user" />
                                        <div className="mt-2">
                                            {content}
                                        </div>

                                        <div className="mt-4 inline-flex gap-4">
                                            <button type="submit" className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ease-in-out duration-300'>
                                                subimit
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ease-in-out duration-300"
                                                onClick={closeModal}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </Form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
} */