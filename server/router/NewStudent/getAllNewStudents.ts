import { AuthRequest, Role } from "../../types";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const getAllNewStudents = async (req: AuthRequest, res: Response) => {
    const role = req.role;
    if(role !== Role.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const students = await db.student.findMany({
        where: {
            groupMentorId: null
        },
        select: {
            name: true,
            createdAt: true,
            id: true,
            callNumber: true
        }
    });
    return res.status(200).json({
        success: true,
        data: students,
    });
}

export default getAllNewStudents;