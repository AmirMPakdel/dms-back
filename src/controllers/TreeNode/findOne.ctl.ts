import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, codeResponse, statusList, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeNodeModel from "@/models/TreeNodeMdl";
import TreeNodeUtil from "@/utils/TreeNodeUtil";


async function findOne(req: Request, res: Response) {
    //TODO: check inputs
    const { id, with_tags, with_employee } = req.body;

    let treeNode:TreeNodeModel|null  = await TreeNodeModel.findOne({
        where: { id },
    });

    if(!treeNode){

        codeResponse(res, statusList.OBJECT_NOT_FOUND, null);
        return;
    }

    if(with_tags){

        let treeNodes = await TreeNodeUtil.combineTreeNodesTags([treeNode]);

        console.log(treeNodes);
        
        if(treeNodes && treeNodes[0]){

            treeNode = treeNodes[0];

        }else{

            codeResponse(res, statusList.OBJECT_NOT_FOUND, {message:"(treeNodes && treeNodes[0]) is not true"});
            return;
        }
    }

    // if(with_employee){

    //     let employee = await EmployeeModel.findOne({where:{id:treeNode.employee_id}});

    //     if(employee){
    //         treeNode.dataValues.employee=employee;
    //     }
    // }

    successResponse(res, treeNode.toJSON());
}

export default async function (req: Request, res: Response) {
    try {
        await findOne(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
