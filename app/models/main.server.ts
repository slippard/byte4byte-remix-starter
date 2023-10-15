import { BugReport, ContactRequest, User } from "@prisma/client"

import { prisma } from "~/db.server"

export const sendMessage = ({ name, phone, message }: { name: string, phone: string, message: string }) => {
    /* use nodemailer or someting to send email */

    return prisma.contactRequest.create({
        data: {
            name,
            phone,
            message
        }
    })
}

export const deleteMessageById = (id: ContactRequest["id"]) => {
    return prisma.contactRequest.delete({ where: { id } })
}

export const createBugReport = (userId: User["id"], report: BugReport["report"]) => {
    return prisma.bugReport.create({
        data: {
            report,
            userId
        }
    })
}