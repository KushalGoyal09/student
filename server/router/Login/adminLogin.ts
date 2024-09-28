import { getToken } from "../../utils/auth";
import { Role } from "../../types";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();

const adminLogin = async (username: string, password: string) => {
    if (username !== "admin") {
        return null;
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
        return null;
    }
    if (password !== admin.password) {
        throwUnauthorizedError("Password incorrect");
        return null;
    }
    const token = getToken("admin", Role.admin);
    return token;
};

export default adminLogin;
