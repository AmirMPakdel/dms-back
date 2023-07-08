import { Request, Response } from "express";
import UserModel from "@/models/UserMdl";
import { BaseError } from "sequelize";
import { IEResponse, codeResponse, statusList, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";

async function loadUserInfoCtl(req: Request, res: Response) {
    //check inputs
    let username = req.currentUser?.username;
    let id = req.currentUser?.tree_id;

    let user = await UserModel.findOne({where:{
        username,
        id
    }});

    if(!user){
        codeResponse(res, statusList.AUTH_FAILED, {message: "user not found! username:"+username});
        return;
    }

    let data = user.toJSON();

    delete data.password;

    successResponse(res, data);
}


export default async function(req: Request, res: Response) {

    try{

        await loadUserInfoCtl(req, res);

    }catch(e){

        Log.e("catched outside!->"+(e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}