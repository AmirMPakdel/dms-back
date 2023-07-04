import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";

async function _delete(req: Request, res: Response) {
    //TODO: check inputs
    const { id } = req.body;

    //TODO: get node's subtree

    //TODO: delete all subtree nodes and this node

    //newTreeNodeTag = await newTreeNodeTag.save();

    //successResponse(res, newTreeNodeTag.toJSON());
}

export default async function (req: Request, res: Response) {
    try {
        await _delete(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}