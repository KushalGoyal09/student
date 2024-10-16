import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest } from "../../types";
import { z } from "zod";

const bodySchema = z.object({
    students: z.array(z.string()),
});

const getAddress = async (req: AuthRequest, res: Response) => {
    const { students } = bodySchema.parse(req.body);
    const student = await db.student.findMany({
        where: {
            id: {
                in: students,
            },
        },
        select: {
            completeAddress: true,
            landmark: true,
            city: true,
            state: true,
            pincode: true,
            country: true,
            callNumber: true,
            name: true,
            email: true,
            id: true,
        },
    });
    return res.status(200).json({
        success: true,
        data: student,
    });
};

export default getAddress;
