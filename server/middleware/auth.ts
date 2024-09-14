import { Request, Response, NextFunction } from "express";
import {
    throwForbiddenError,
    throwUnauthorizedError,
} from "../custom-error/customError";
import { getUser} from "../utils/auth"
import { AuthRequest } from "../types";

const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        throwUnauthorizedError("No Token Found");
        return;
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        throwUnauthorizedError("No Token Found");
        return;
    }

    try {
        const payload = getUser(token);
        if (payload) {
            req.userId = payload.userId;
            req.role = payload.role;
            next();
            return;
        } else {
            throwForbiddenError("Invalid Token")
        }
    } catch (error) {
        throwForbiddenError("Invalid token");
        return;
    }
};

export default authMiddleware;
