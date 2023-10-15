import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";

import { deleteReportById, getReportList, reopenReportById, resolveReportById } from "~/models/reports.server";
import { getUserById, getUserList } from "~/models/user.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action")

    if (typeof action != "string" || action.length <= 2) {
        return json({ status: 418, message: "Invalid Action" })
    }

    if (action === 'resolve-report') {
        const reportId = formData.get("reportId")
        if (typeof reportId != "string" || reportId.length <= 2) {
            return json({ status: 418, message: "Invalid reportId" })
        }
        const report = await resolveReportById(reportId)
        return json({ status: 200, message: `Resolved ${report.id}` })
    }

    if (action === 'reopen-report') {
        const reportId = formData.get("reportId")
        if (typeof reportId != "string" || reportId.length <= 2) {
            return json({ status: 418, message: "Invalid reportId" })
        }
        const report = await reopenReportById(reportId)
        return json({ status: 200, message: `Re-opened ${report.id}` })
    }

    if (action === 'delete-report') {
        const reportId = formData.get("reportId")
        if (typeof reportId != "string" || reportId.length <= 2) {
            return json({ status: 418, message: "Invalid reportId" })
        }
        const report = await deleteReportById(reportId)
        return json({ status: 200, message: `Deleted ${report.id}` })
    }

    return json({ status: 418, message: "Invalid Action" })
};

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request);
    const userList = await getUserList()
    const user = await getUserById(userId)
    const reportList = await getReportList()
    return { user, reportList, userList }
};

export default function DashboardBugreport() {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="p-8 w-full max-w-7xl">
            <h1 className="text-3xl">Bug Reports</h1>
            <div className="w-full grid grid-cols-12 gap-2">
                {data.reportList.map((report, i) => {
                    const reportee = data.userList.filter((user => user.id === report.userId))[0]
                    console.log(`Reported by: ${reportee.email}`)
                    return (
                        <div key={i} className="flex flex-col gap-2 p-2 justify-between h-full col-span-12 md:col-span-6 xl:col-span-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p>Reported By: {reportee.email}</p>
                            <p>Status: {report.resolved ? <span className="bg-green-200 text-green-800 rounded-3xl px-2">Resolved</span> : <span className="bg-red-200 text-red-800 rounded-3xl px-2">open</span>}</p>
                            <p className="font-mono text-xs">{report.report}</p>
                            <div className="w-full inline-flex gap-2">
                                {report.resolved ?
                                    <>
                                        <Form method="post">
                                            <input type="hidden" name="_action" value="reopen-report" />
                                            <input type="hidden" name="reportId" value={report.id} />
                                            <button type="submit" className="btn-sm btn btn-warning">Reopen Report</button>
                                        </Form>
                                        <Form method="post">
                                            <input type="hidden" name="_action" value="delete-report" />
                                            <input type="hidden" name="reportId" value={report.id} />
                                            <button type="submit" className="btn-sm btn btn-error">Delete Report</button>
                                        </Form>
                                    </>
                                    :
                                    <Form method="post">
                                        <input type="hidden" name="_action" value="resolve-report" />
                                        <input type="hidden" name="reportId" value={report.id} />
                                        <button type="submit" className="btn-sm btn  btn-success">Resolve Report</button>
                                    </Form>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}