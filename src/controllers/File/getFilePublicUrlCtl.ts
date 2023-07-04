import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse, codeResponse, statusList } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import AccessLinkModel from "@/models/AccessLinkMdl";
import FileModel from "@/models/FileMdl";
import { v4 as uuidv4 } from "uuid";
import TreeNodeModel from "@/models/TreeNodeMdl";

async function getFilePublicUrlCtl(req: Request, res: Response) {

    const { file_id } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let file = await TreeNodeModel.findOne({
        where: {
            id: file_id,
            tree_id,
        }
    });

    if (!file) {
        
        codeResponse(res, statusList.OBJECT_NOT_FOUND, { message: `file id=${file_id} not found` })
        
        return;
    }

    let accessLink = await AccessLinkModel.findOne({
        where: {
            file_id: file.id,
            type: "public",
        }
    });

    if (accessLink) {

        successResponse(res, { uuid: accessLink.uuid });

        return;

    } else {

        let new_uuid = uuidv4();

        accessLink = new AccessLinkModel({
            file_id,
            type: "public",
            uuid: new_uuid,
        });

        try{

            accessLink = await accessLink.save();

        }catch(e){

            IEResponse(res, { message: (e as BaseError).message });
        }
        
        successResponse(res, { uuid: accessLink.uuid });

        return;
    }
}


export default async function (req: Request, res: Response) {
    try {
        await getFilePublicUrlCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
