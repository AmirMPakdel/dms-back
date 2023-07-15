import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, codeResponse, statusList, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import fs from "node:fs/promises";
import TreeNodeModel from "@/models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";

async function saveFilePlainContentCtl(req: Request, res: Response) {

    const { file_id, value } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let node = await TreeNodeModel.findOne({
        where: {
            id: file_id,
            tree_id,
        }
    });

    if (!node) {
        
        codeResponse(res, statusList.OBJECT_NOT_FOUND, { message: `node id=${file_id} not found` })
        
        return;
    }

    let file = await FileModel.findOne({
        where: {
            id: node.file_id,
        }
    });

    if (!file) {
        
        codeResponse(res, statusList.OBJECT_NOT_FOUND, { message: `file id=${file_id} not found` })
        
        return;
    }

    //TODO: change file size in db record too

    let file_path = "files/"+file.id+"."+file.ext;

    await fs.writeFile(file_path, value, {encoding:"utf8"});

    successResponse(res, {message:"saved successfully!"});
}

export default async function (req: Request, res: Response) {
    try {
        await saveFilePlainContentCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
