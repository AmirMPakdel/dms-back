import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeModel from "@/models/TreeMdl";
import NodeModel from "@/models/TreeNodeMdl";

async function create(req: Request, res: Response) {
    //TODO: check inputs
    const { title, employee_id } = req.body;

    let newNode = new NodeModel({
        tree_id: 0,
        parent_id: 0,
        employee_id,
    });

    newNode = await newNode.save();

    let newTree = new TreeModel({
        title,
        root_id: newNode.id,
    });

    newTree = await newTree.save();

    newNode.tree_id = newTree.id;

    newNode = await newNode.save({ fields: ["tree_id"] });

    successResponse(res, newTree.toJSON());
}

export default async function (req: Request, res: Response) {
    try {
        await create(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
