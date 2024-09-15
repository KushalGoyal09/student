import { Response, Router } from "express";
import { AuthRequest } from "../../types";
import authMiddleware from "../../middleware/auth";
import { throwUnauthorizedError } from "../../custom-error/customError";
const meRouter = Router();

const getRole = (req: AuthRequest, res: Response) => {
    const { role } = req;
    if (!role) {
        throwUnauthorizedError("You are not authorized to get role");
        return;
    }
    res.json({
        success: true,
        role,
    });
};

meRouter.get("/", authMiddleware, getRole);

export default meRouter;
