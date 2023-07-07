import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeNodeModel from "@/models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";
import SharedNodeModel from "@/models/SharedNodeMdl";

async function getAllFilesInFolderCtl(req: Request, res: Response) {
    //check inputs
    const { parent_id } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let list = [];

    //for shared Files
    if(parent_id == -1){

        let username = req.currentUser?.username;
        console.log(username);
        
        list = await SharedNodeModel.findAll({where:{
            username,
        }});
        console.log(list);

    }else{

        list = await TreeNodeModel.findAll({
            where: {
                tree_id,
                parent_id,
            },
        });
    }

    let files = await FileModel.findAll();

    list.forEach((node) => {
        files.forEach((file) => {
            if (node.file_id === file.id) {
                node.dataValues.file = file.toJSON();
            }
        });
    });

    successResponse(res, list);
}

export default async function (req: Request, res: Response) {
    try {
        await getAllFilesInFolderCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
