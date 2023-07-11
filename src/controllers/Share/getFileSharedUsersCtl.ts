import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "../../utils/AppResponse";
import Log from "../../utils/Log";
import SharedNodeModel from "@/models/SharedNodeMdl";

async function getFileSharedUsersCtl(req: Request, res: Response) {
    //TODO: check inputs
    const { file_id } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let sharedNodes = await SharedNodeModel.findAll({where:{
        file_id,
        owner_id: tree_id,
    }})

    sharedNodes.forEach(n=>{
        n.dataValues.file = {
            name: n.file_name,
            id: n.file_id,
            ext: n.file_ext,
            type: n.file_ext,
        }
    });

    successResponse(res, { list:sharedNodes });
}

export default async function (req: Request, res: Response) {
    try {
        await getFileSharedUsersCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
