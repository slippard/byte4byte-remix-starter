import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserCount() {
  return (await prisma.user.findMany()).length
}

export async function getUserList() {
  return prisma.user.findMany({ select: { email: true, createdAt: true, id: true, updatedAt: true, admin: true, owner: true } })
}

export async function updateUserPasswordById(id: User["id"], password: string) {
  const newPass = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { id },
    data: {
      password: {
        update: {
          hash: newPass
        }
      }
    }
  })
}

export async function createUser(email: User["email"], password: string, admin: User["admin"]) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      admin,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export const setUserAdmin = ({ userId, admin }: { userId: string, admin: boolean }) => {
  return prisma.user.update({ where: { id: userId }, data: { admin } })
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
