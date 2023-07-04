import { Request, Response } from "express";
import UserModel from "@/models/UserMdl";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseError } from "sequelize";
import env from "../../env";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import { Password } from "@/utils/Password";
import TreeModel from "@/models/TreeMdl";

async function signupUserCtl(req: Request, res: Response) {
    //check inputs
    const { username, password, firstname, lastname, national_code } = req.body;

    //TODO: check if user with same username or national_code exists

    // encrypt user password
    const encryptedPassword = await Password.toHash(password);

    let newUser = new UserModel({
        username,
        password: encryptedPassword,
        firstname,
        lastname,
        national_code,
    });

    try {
        newUser = await newUser.save();
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    // create tree
    let newTree = new TreeModel({
        user_id: newUser.id,
        root_id: 0,
    });

    try {
        newTree = await newTree.save();
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    // create token
    const token = jwt.sign(
        {
            tree_id: newTree.id,
            username: newUser.username,
        },
        env.JWT_SECRET,
        {
            expiresIn: "90d",
        }
    );

    // save token and tree_id
    newUser.token = token;
    newUser.tree_id = newTree.id;

    try {
        newUser = await newUser.save({ fields: ["token", "tree_id"] });
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    let data = newUser.toJSON();
    delete data.password;

    successResponse(res, data);
}

export default async function (req: Request, res: Response) {
    try {
        await signupUserCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
