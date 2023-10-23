import { BugReport, ContactRequest, HoneyPot, User } from "@prisma/client"

import { prisma } from "~/db.server"

export const sendMessage = ({ name, phone, message }: { name: string, phone: string, message: string, origin?: string }) => {
    /* use nodemailer or someting to send email */
    return prisma.contactRequest.create({
        data: {
            name,
            phone,
            message
        }
    })
}

export const getHoneyPotList = () => {
    return prisma.honeyPot.findMany()
}

export const markMessageSpam = async ({ id }: { id: string }) => {
    const message = await prisma.contactRequest.findFirst({ where: { id } })
    await prisma.honeyPot.create({
        data: {
            name: message!.name,
            message: message!.message,
            phone: message!.phone,
            origin: message!.origin
        }
    })
    return await deleteMessageById(message!.id)
}

export const restoreMessage = async ({ id }: { id: string }) => {
    const message = await prisma.honeyPot.findFirst({ where: { id } })
    await sendMessage({ name: message!.name, phone: message!.phone, message: message!.message, origin: message!.origin })
    return deleteHoneyById(message!.id)
}

export const addHoneyPot = ({ name, phone, message }: { name: string, phone: string, message: string, origin?: string }) => {
    return prisma.honeyPot.create({
        data: {
            name,
            phone,
            message
        }
    })
}

export const deleteHoneyById = (id: HoneyPot["id"]) => {
    return prisma.honeyPot.delete({ where: { id } })
}


export const sendServiceMessage = ({ name, phone, message, origin }: { name: string, phone: string, message: string, origin: string }) => {
    return prisma.contactRequest.create({
        data: {
            name,
            phone,
            message,
            origin
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