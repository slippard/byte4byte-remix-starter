import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export async function checkCode(code: string) {
    if (code === 'adminpls') {
        const user = await prisma.user.findFirst({ where: { email: "demo@proton.me" } });
        if (user?.id) {
            return { status: 418, message: "Cannot run twice" }
        } else {
            const hashedPassword = await bcrypt.hash("demopass", 10);
            await prisma.user.create({
                data: {
                    email: "demo@proton.me",
                    admin: true,
                    password: {
                        create: {
                            hash: hashedPassword
                        }
                    }
                }
            })
            return { status: 200, message: "User Created" }
        }
    }

    // return json({ status: 418, user: null, message: "Something went wrong" })
    return { status: 418, message: "Something went wrong. No Code?" }
}