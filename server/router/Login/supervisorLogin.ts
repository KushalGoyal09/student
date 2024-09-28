import { PrismaClient } from "prisma/prisma-client";
import { throwUnauthorizedError } from "../../custom-error/customError";
import { getToken } from "../../utils/auth";
import { Role } from "../../types";
const db = new PrismaClient();

const supervisorLogin = async (username: string, password: string) => {
    const supervisor = await db.supervisor.findUnique({
        where: {
            username,
        },
        select: {
            password: true,
            id: true,
        },
    });
    if (!supervisor) {
        return null;
    }
    if (password !== supervisor.password) {
        throwUnauthorizedError("Password incorrect");
        return null;
    }
    const token = getToken(supervisor.id, Role.supervisor);
    return token;
};

export default supervisorLogin;
