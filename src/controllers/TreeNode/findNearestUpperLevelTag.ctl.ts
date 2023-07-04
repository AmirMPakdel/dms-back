import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, codeResponse, statusList, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeUtil from "@/utils/TreeUtil";
//import EmployeeModel from "@/models/Employee.mdl";

async function findNearestUpperLevelTag(req: Request, res: Response) {
    //TODO: check inputs
    let { tag_id, node_id, tree_id } = req.body;

    tag_id = Number(tag_id);

    node_id = Number(node_id);

    tree_id = Number(tree_id);

    let treeNodes = await TreeUtil.getTreeNodesById(tree_id);

    let node = await TreeUtil.findNearestUpperLevelTag(tag_id, treeNodes, node_id);

    if(node == null){

        codeResponse(res, statusList.OBJECT_NOT_FOUND, req.body);
        return;
    }

    // let employee = await EmployeeModel.findOne({where:{id: node.employee_id}, raw:true}); 

    // if(employee == null){

    //     IEResponse(res, {node, message:"employee not found"});
    //     return;
    // }

    // successResponse(res, {node, employee});
    successResponse(res, {node});
}

export default async function (req: Request, res: Response) {
    try {
        await findNearestUpperLevelTag(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
