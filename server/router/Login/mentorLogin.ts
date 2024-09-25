import { PrismaClient } from "prisma/prisma-client";
import {
    throwUnauthorizedError,
} from "../../custom-error/customError";
import { getToken } from "../../utils/auth";
import { Role } from "../../types";
const db = new PrismaClient();

const mentorLogin = async (username: string, password: string) => {
    const mentor = await db.groupMentor.findUnique({
        where: {
            username,
        },
        select: {
            password: true,
            id: true,
        },
    });
    if (!mentor) {
        return null;
    }
    if (password !== mentor.password) {
        throwUnauthorizedError("Password incorrect");
        return null;
    }
    const token = getToken(mentor.id, Role.groupMentor);
    return token;
};

export default mentorLogin;
