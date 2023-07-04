import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeNodeModel from "@/models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";

async function getAllFileInPrvFolderCtl(req: Request, res: Response) {
    //check inputs
    const { file_id } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let node = await TreeNodeModel.findOne({where:{
        id: file_id,
        tree_id
    }});

    if(!node){
        IEResponse(res, { message: "node not found" });
        return;
    }

    
    let treeNodes = await TreeNodeModel.findAll({
        where: {
            parent_id: node.parent_id,
            tree_id,
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

    successResponse(res, {list:treeNodes, parent_node_id:node.parent_id});
}

export default async function (req: Request, res: Response) {
    try {
        await getAllFileInPrvFolderCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
