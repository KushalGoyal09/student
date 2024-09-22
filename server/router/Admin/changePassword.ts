import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();
import { Response } from "express";
import { AuthRequest, Role } from "../../types";
import {
    throwBadRequestError,
    throwUnauthorizedError,
} from "../../custom-error/customError";
import { z } from "zod";

const bodySchemaChangePassword = z.object({
    newPassword: z.coerce.string(),
});

const changePassword = async (req: AuthRequest, res: Response) => {
    if (req.role !== Role.admin) {
        throwUnauthorizedError("You are not authorized to change password");
        return;
    }
    const parsedData = bodySchemaChangePassword.safeParse(req.body);
    if (!parsedData.success) {
        throwBadRequestError("Wrong Inputs");
        return;
    }
    const { newPassword } = parsedData.data;
    await db.admin.update({
        where: {
            username: "admin",
        },
        data: {
            password: newPassword,
        },
    });
    res.json({
        success: true,
        message: "Password changed successfully",
    });
};

export default changePassword;
