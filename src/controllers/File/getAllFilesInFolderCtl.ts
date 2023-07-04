import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeNodeModel from "@/models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";

async function getAllFilesInFolderCtl(req: Request, res: Response) {
    //check inputs
    const { parent_id } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let treeNodes = await TreeNodeModel.findAll({
        where: {
            tree_id,
            parent_id,
        },
    });

    let files = await FileModel.findAll();

    treeNodes.forEach((node) => {
        files.forEach((file) => {
            if (node.file_id === file.id) {
                node.dataValues.file = file.toJSON();
            }
        });
    });

    successResponse(res, treeNodes);
}

export default async function (req: Request, res: Response) {
    try {
        await getAllFilesInFolderCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
