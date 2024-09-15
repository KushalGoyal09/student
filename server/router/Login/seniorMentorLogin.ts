import { Response,Request } from "express";
import { PrismaClient } from "prisma/prisma-client";
import { z } from "zod";
import { throwBadRequestError, throwForbiddenError, throwUnauthorizedError } from "../../custom-error/customError";
import { getToken } from "../../utils/auth";
import { Role } from "../../types";
const db = new PrismaClient();

const bodySchema = z.object({
    username: z.coerce.string(),
    password: z.coerce.string(),
});

const seniorMentorLogin = async (req: Request, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        throwForbiddenError("Wrong Inputs");
        return;
    }
    const { username, password } = parsedData.data;
    const mentor = await db.seniorMentor.findUnique({
        where: {
            username,
        },
        select: {
            password: true,
            id: true
        },
    });
    if (!mentor) {
        throwBadRequestError("username incorrect");
        return;
    }
    if (password !== mentor.password) {
        throwUnauthorizedError("Password incorrect");
        return;
    }
    const token = getToken(mentor.id, Role.seniorMentor)
    res.json({
        success: true,
        message: "Senior Mentor loged in successfully",
        token
    });
}

export default seniorMentorLogin;