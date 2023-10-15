import type { Task } from "@prisma/client";

import { prisma } from "~/db.server";
export type { Task } from "@prisma/client";

export const getTaskList = () => {
    return prisma.task.findMany({ orderBy: { createdAt: "desc" } })
}

export const createTask = (title: Task["title"]) => {
    return prisma.task.create({
        data: {
            title
        }
    })
}

export const toggleTaskCompleted = (completed: Task["completed"], id: Task["id"],) => {
    return prisma.task.update({
        where: {
            id
        },
        data: {
            completed
        }
    })
}

export const deleteTaskById = (id: Task["id"]) => {
    return prisma.task.delete({ where: { id } })
}