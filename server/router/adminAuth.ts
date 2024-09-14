import { Response, Router, Request } from "express";
import { getToken } from "../utils/auth";
const router = Router();
import { z } from "zod";
import { AuthRequest, Role } from "../types";
import {
    throwBadRequestError,
    throwUnauthorizedError,
} from "../custom-error/customError";
import { PrismaClient } from "prisma/prisma-client";
import authMiddleware from "../middleware/auth";
const db = new PrismaClient();

const bodySchema = z.object({
    username: z.coerce.string(),
    password: z.coerce.string(),
});

const adminLogin = async (req: Request, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        throwBadRequestError("Wrong Inputs");
        return;
    }
    const { username, password } = parsedData.data;
    if (username !== "admin") {
        throwUnauthorizedError("username incorrect");
        return;
    }
    const admin = await db.admin.findUnique({
        where: {
            username,
        },
        select: {
            password: true,
        },
    });
    if (!admin) {
        throwUnauthorizedError("username incorrect");
        return;
    }
    if (password !== admin.password) {
        throwUnauthorizedError("Password incorrect");
        return;
    }
    const token = getToken("admin", Role.admin);
    res.json({
        success: true,
        message: "Admin loged in successfully",
        token: token,
    });
};

const bodySchemaChangePassword = z.object({
    newPassword: z.coerce.string(),
});

const changePassword = async (req: AuthRequest, res: Response) => {
    if(req.role !== Role.admin) {
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
}

router.post("/login", adminLogin);
router.post("/changePassword", authMiddleware ,changePassword);

export default router;
