import { Request, Response } from "express";
import UserModel from "@/models/UserMdl";
import jwt from "jsonwebtoken";
import { BaseError } from "sequelize";
import env from "../../env";
import { IEResponse, codeResponse, statusList, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import { Password } from "@/utils/Password";
import axios from "axios";
import * as https from "https";
import TreeModel from "@/models/TreeMdl";

async function loginWithCasCtl(req: Request, res: Response) {
    //check inputs
    const { credential } = req.body;

    let req_result:any;

    try {
        let httpsAgent = new https.Agent({rejectUnauthorized:false});
        
        req_result = await axios.post(env.CAS_GET_TOKEN_URL, {credential}, {httpsAgent});

    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    let result = req_result.data;

    if(result.code == 1000){

        let user_exists = true;

        let cas_token = result.data.token;
        let user_data = result.data.user_data;

        let user = await UserModel.findOne({where:{
            username: user_data.username
        }});

        if(!user){
            user_exists = false;
            user = new UserModel();
            user.username = user_data.username;
        }

        user.firstname = user_data.firstname;
        user.lastname = user_data.lastname;
        user.national_code = user_data.kode_meli;
        user.firstname = user_data.firstname;

        let sso_password = await Password.toHash(env.CAS_LOGIN_PASSWORD);

        user.password = sso_password;
        user.sso_token = cas_token;

        user = await user.save();

        if(!user_exists){
            //Create user tree
            let newTree = new TreeModel({
                user_id: user.id,
                root_id: 0,
            });
    
            try {
                newTree = await newTree.save();
                user.tree_id = newTree.id;
            } catch (e) {
                IEResponse(res, { message: (e as BaseError).message });
                return;
            }
        }

        const token = jwt.sign(
            {
                tree_id: user.tree_id,
                username: user.username,
            },
            env.JWT_SECRET,
            {
                expiresIn: "90d",
            }
        );

        // save token and tree_id
        user.token = token;

        try {
            user = await user.save();
        } catch (e) {
            IEResponse(res, { message: (e as BaseError).message });
            return;
        }
    
        let data = user.toJSON();
        delete data.password;
    
        successResponse(res, data);

    }else{

        codeResponse(res, statusList.WRONG_CREDENTIAL, {
            cas_response: result,
            message:statusList.WRONG_CREDENTIAL.error});
    }
}

export default async function (req: Request, res: Response) {

    try {

        await loginWithCasCtl(req, res);

    } catch (e) {

        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
