import { Request, Response } from "express";
import UserModel from "@/models/UserMdl";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseError } from "sequelize";
import env from "../../env";
import { IEResponse, codeResponse, statusList, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import { Password } from "@/utils/Password";

async function loginUserCtl(req: Request, res: Response) {
    //check inputs
    const { username, password } = req.body;

    let user:UserModel|null;
    

    try {
        user = await UserModel.findOne({where:{username}});
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    if(!user){
        codeResponse(res, statusList.AUTH_FAILED, {message:statusList.AUTH_FAILED.error});
        return;
    }

    let passwords_match = await Password.compare(user.password, password);

    if(!passwords_match){
        codeResponse(res, statusList.AUTH_FAILED, {message:statusList.AUTH_FAILED.error});
        return;
    }

    // Create token
    const token = jwt.sign(
        {
            tree_id: user.tree_id,
            username: user.username,
        },
        env.JWT_SECRET,
        {
            expiresIn: "12h",
        }
    );

    // save token
    user.token = token;

    try {
        user = await user.save({ fields: ["token"] });
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    let data = user.toJSON();
    delete data.password;
    
    successResponse(res, data);
}

export default async function (req: Request, res: Response) {

    try {

        await loginUserCtl(req, res);

    } catch (e) {

        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
