import { prisma } from "~/db.server"

export const getMessageList = () => {
    return prisma.contactRequest.findMany({})
}