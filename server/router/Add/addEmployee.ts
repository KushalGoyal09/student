import { PrismaClient, Prisma } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import { z } from "zod";
import { throwForbiddenError } from "../../custom-error/customError";

const bodySchema = z.object({
    name: z.string(),
    phoneNumber: z.string(),
});

const addEmployee = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwForbiddenError("You are not authorized to add a Employee");
        return;
    }
    const parsedData = bodySchema.safeParse(req.body);
    if (parsedData.success === false) {
        throwForbiddenError("Wrong Inputs");
        return;
    }
    const { phoneNumber, name } = parsedData.data;
    await db.employee.create({
        data: {
            name,
            phoneNumber,
        },
    });
    res.json({
        success: true,
        message: `Employee ${name} is added successfully`,
    });
};

export default addEmployee;
