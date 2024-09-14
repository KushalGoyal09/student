import { verify, sign } from "jsonwebtoken";
import Secret from "./secrets";
import { Role } from "../types";

export const getToken = (userId: string, role: Role) => {
    const token = sign(
        {
            userId: userId,
            role: role,
        },
        Secret.SECRET,
    );
    return token;
};

export const getUser = (token: string) => {
    try {
        const user = verify(token, Secret.SECRET) as any;
        return {
            userId: user.userId as string,
            role: user.role as Role,
        };
    } catch (error) {
        return null;
    }
};
