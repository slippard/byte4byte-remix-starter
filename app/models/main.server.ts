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