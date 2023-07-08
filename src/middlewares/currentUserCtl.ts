import { codeResponse, statusList } from "@/utils/AppResponse";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    username: number;
    tree_id: number;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const payload = jwt.verify(req.body.token, process.env.JWT_SECRET!) as UserPayload;
        req.currentUser = payload;
        next();
    } catch (err) {
        codeResponse(res, statusList.AUTH_FAILED, {message: err});
    }
};
