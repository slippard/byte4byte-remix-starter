import { BugReport } from "@prisma/client"

import { prisma } from "~/db.server"

export const getReportList = () => {
    return prisma.bugReport.findMany({})
}

export const resolveReportById = (id: BugReport["id"]) => {
    return prisma.bugReport.update({
        where: {
            id
        },
        data: {
            resolved: true
        }
    })
}

export const reopenReportById = (id: BugReport["id"]) => {
    return prisma.bugReport.update({
        where: {
            id
        },
        data: {
            resolved: false
        }
    })
}

export const deleteReportById = (id: BugReport["id"]) => {
    return prisma.bugReport.delete({ where: { id } })
}