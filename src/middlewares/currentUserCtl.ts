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
    // if (!req.session?.jwt) {
    //     return next();
    // }

    //req.session.jwt,
    try {
        console.log("jwt "+req.body.token);
        
        const payload = jwt.verify(req.body.token, process.env.JWT_SECRET!) as UserPayload;
        req.currentUser = payload;
        console.log(req.currentUser);
        
    } catch (err) {
        console.log(err);
    }

    next();
};
