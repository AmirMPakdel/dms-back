import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, codeResponse, statusList, successResponse } from "../../utils/AppResponse";
import Log from "../../utils/Log";
import TreeNodeModel from "../../models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";
import fs from "node:fs/promises";

async function deleteFileCtl(req: Request, res: Response) {
    //TODO: check inputs
    const { file_id } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let file = await FileModel.findOne({where:{
        id: file_id,
        tree_id,
    }});

    if(!file){
        codeResponse(res, statusList.OBJECT_NOT_FOUND, {message:`file id=${file_id} not found!`});
        return;
    }

    let node = await TreeNodeModel.findOne({where:{
        file_id: file.id
    }});

    if(!node){
        codeResponse(res, statusList.OBJECT_NOT_FOUND, {message:`node file_id=${file_id} not found!`});
        return;
    }

    if(file.type === "folder"){

        //TODO: delete files recursivly

    }else{

        let file_stat = await fs.stat("files/"+file.id+"."+file.ext);

        if(file_stat.isFile()){

            await file.destroy();
            await node.destroy();
            await fs.unlink("files/"+file.id+"."+file.ext);

            successResponse(res, {messsage:"file deleted!"});

        }else{
            codeResponse(res, statusList.OBJECT_NOT_FOUND, {message:`file path=${file.id+"."+file.ext} not found!`});
            return;
        }

    }
}

export default async function (req: Request, res: Response) {
    try {
        await deleteFileCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
