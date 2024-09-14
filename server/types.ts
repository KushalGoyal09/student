import { Request } from "express";

export enum Role {
    superAdmin,
    admin,
    supervisor,
    seniorMentor,
    groupMentor,
    user
}

export interface AuthRequest<T = {}, P = {}, R = {}> extends Request<T, P, R> {
    userId?: string;
    role?: Role;
}