import { Response, Request } from "express";
import { getToken } from "../../utils/auth";
import { z } from "zod";
import { Role } from "../../types";
import {
    throwBadRequestError,
    throwUnauthorizedError,
} from "../../custom-error/customError";
import { PrismaClient } from "prisma/prisma-client";
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

export default adminLogin;
