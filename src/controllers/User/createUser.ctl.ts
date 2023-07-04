import { Request, Response } from "express";
import UserModel from "@/models/UserMdl";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseError } from "sequelize";
import env from "../../env";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";

async function createUserController(req: Request, res: Response) {
    //check inputs
    const { username, password, firstName, lastName, employee_id } = req.body;

    //TODO:: check employee_id input and set in db

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    let newUser = new UserModel({
        username,
        password: encryptedPassword,
        firstName,
        lastName,
        employee_id,
    });

    try {
        newUser = await newUser.save();
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    // Create token
    const token = jwt.sign(
        {
            user_id: newUser.id,
            username: newUser.username,
        },
        env.JWT_SECRET,
        {
            expiresIn: "12h",
        }
    );

    // save token
    newUser.token = token;

    try {
        newUser = await newUser.save({ fields: ["token"] });
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    successResponse(res, newUser.toJSON());
}


export default async function(req: Request, res: Response) {

    try{

        await createUserController(req, res);

    }catch(e){

        Log.e("catched outside!->"+(e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}