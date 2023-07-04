import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeNodeModel from "@/models/TreeNodeMdl";
import TreeNodeUtil from "@/utils/TreeNodeUtil";

async function findAllTreeNodes(req: Request, res: Response) {
    //TODO: check inputs
    const { tree_id, with_tags, with_employees } = req.body;

    let tree_nodes:Array<TreeNodeModel>|null = await TreeNodeModel.findAll({
        where: { tree_id },
    });

    if(with_tags && tree_nodes){
        
        tree_nodes = await TreeNodeUtil.combineTreeNodesTags(tree_nodes);
    }

    if(with_employees && tree_nodes){

        tree_nodes = await TreeNodeUtil.combineEmployeeTreeNodes(tree_nodes);
    }

    successResponse(res, tree_nodes);
}

export default async function (req: Request, res: Response) {
    try {
        await findAllTreeNodes(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}