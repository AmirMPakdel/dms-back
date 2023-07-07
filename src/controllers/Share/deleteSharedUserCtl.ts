import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "../../utils/AppResponse";
import Log from "../../utils/Log";
import SharedNodeModel from "@/models/SharedNodeMdl";

async function deleteSharedUserCtl(req: Request, res: Response) {
    //TODO: check inputs
    const { shared_node_id, type } = req.body;

    let owner_id = req.currentUser?.tree_id;
    let username = req.currentUser?.username;

    let cond:any = {
        id: shared_node_id,
    }

    if(type=="owner"){
        cond.owner_id = owner_id;
    }else{
        cond.username = username;
    }

    await SharedNodeModel.destroy({where:cond});
    
    successResponse(res, { message:"share node deleted successfuly!"});
}

export default async function (req: Request, res: Response) {
    try {
        await deleteSharedUserCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
