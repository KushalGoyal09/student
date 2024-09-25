import { Router, Request, Response } from "express";
const LoginRouter = Router();
import adminLogin from "./adminLogin";
import supervisorLogin from "./supervisorLogin";
import seniorMentorLogin from "./seniorMentorLogin";
import mentorLogin from "./mentorLogin";
import { z } from "zod";
import { throwBadRequestError } from "../../custom-error/customError";
import { Role } from "../../types";

const bodySchema = z.object({
    username: z.coerce.string(),
    password: z.coerce.string(),
});

const login = async (req: Request, res: Response) => {
    const parsedData = bodySchema.safeParse(req.body);
    if (!parsedData.success) {
        throwBadRequestError(parsedData.error.errors[0].message);
        return;
    }
    const { username, password } = parsedData.data;
    const adminToken = await adminLogin(username, password);
    if (adminToken) {
        res.json({
            token: adminToken,
            success: true,
            message: "Login successful",
            role: Role.admin,
        });
        return;
    }
    const supervisorToken = await supervisorLogin(username, password);
    if (supervisorToken) {
        res.json({
            token: supervisorToken,
            success: true,
            message: "Login successful",
            role: Role.supervisor,
        });
        return;
    }
    const seniorMentorToken = await seniorMentorLogin(username, password);
    if (seniorMentorToken) {
        res.json({
            token: seniorMentorToken,
            success: true,
            message: "Login successful",
            role: Role.seniorMentor,
        });
        return;
    }
    const mentorToken = await mentorLogin(username, password);
    if (mentorToken) {
        res.json({
            token: mentorToken,
            success: true,
            message: "Login successful",
            role: Role.groupMentor,
        });
        return;
    }
    throwBadRequestError("Invalid credentials");
    return;
};

LoginRouter.post("/", login);

export default LoginRouter;
