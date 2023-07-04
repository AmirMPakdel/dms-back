import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeModel from "@/models/TreeMdl";

async function update(req: Request, res: Response) {
    //TODO: check inputs
    const { tree_id, title } = req.body;

    let trees = await TreeModel.update({title}, { where: { tree_id } });

    successResponse(res, trees);
}

export default async function (req: Request, res: Response) {
    try {
        await update(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
