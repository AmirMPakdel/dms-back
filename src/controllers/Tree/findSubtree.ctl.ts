import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeUtil from "@/utils/TreeUtil";

async function findSubtree(req: Request, res: Response) {
    //TODO: check inputs
    let { node_id, tree_id } = req.body;

    node_id = Number(node_id);

    tree_id = Number(tree_id);

    let treeNodes = await TreeUtil.getTreeNodesById(tree_id);

    let subTree = await TreeUtil.getSubtreeNodes(treeNodes, node_id);

    if(subTree !== null){

        // subTree = await TreeUtil.combineTreeNodesTags(subTree);

        // console.log(subTree);
    }

    successResponse(res, subTree);
}

export default async function (req: Request, res: Response) {
    try {
        await findSubtree(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
