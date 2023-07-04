import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, codeResponse, statusList, successResponse } from "../../utils/AppResponse";
import Log from "../../utils/Log";
import TreeNodeModel from "../../models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";

async function renameFileCtl(req: Request, res: Response) {
    //TODO: check inputs
    const { file_id, name } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let node = await TreeNodeModel.findOne({where:{
        file_id,
        tree_id
    }});

    if(!node){
        codeResponse(res, statusList.OBJECT_NOT_FOUND, { message: `node file_id=${file_id} not found` })
        return;
    }

    let file =  await FileModel.findOne({where:{
        id: node.file_id,
    }});

    if(!file){
        codeResponse(res, statusList.OBJECT_NOT_FOUND, { message: `file id=${file_id} not found` })
        return;
    }

    file.name = name;

    file = await file.save({fields:["name"]});

    successResponse(res, { file: file.toJSON(), message:"renamed successfuly!"});
}

export default async function (req: Request, res: Response) {
    try {
        await renameFileCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
