import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, codeResponse, statusList, successResponse } from "../../utils/AppResponse";
import Log from "../../utils/Log";
import TreeNodeModel from "../../models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";
import SharedNodeModel from "@/models/SharedNodeMdl";

async function addShareUserCtl(req: Request, res: Response) {
    //TODO: check inputs
    const { file_id, username } = req.body;

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

    let newSharedNode = new SharedNodeModel({
        node_id: node.id,
        file_id,
        username,
        owner_id: tree_id,
        file_name: file.name,
        file_ext: file.ext,
    });

    try {
        newSharedNode = await newSharedNode.save();
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    successResponse(res, { sharedNode: newSharedNode.toJSON(), message:"share node created successfuly!"});
}

export default async function (req: Request, res: Response) {
    try {
        await addShareUserCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
