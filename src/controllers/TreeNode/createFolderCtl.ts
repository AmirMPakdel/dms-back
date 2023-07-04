import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "../../utils/AppResponse";
import Log from "../../utils/Log";
import TreeNodeModel from "../../models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";

async function createFolder(req: Request, res: Response) {
    //TODO: check inputs
    const { name, type, parent_id } = req.body;

    let tree_id = req.currentUser?.tree_id;

    //create File
    let newFile = new FileModel({
        name,
        type,
    });

    newFile = await newFile.save();

    //create Node
    let newTreeNode = new TreeNodeModel({
        tree_id,
        parent_id,
        file_id: newFile.id,
        name,
    });

    newTreeNode = await newTreeNode.save();

    //response succes
    successResponse(res, {
        node: newTreeNode.toJSON(),
        file: newFile.toJSON(),
    });
}

export default async function (req: Request, res: Response) {
    try {
        await createFolder(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
