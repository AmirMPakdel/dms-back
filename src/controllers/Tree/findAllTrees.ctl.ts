import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeModel from "@/models/TreeMdl";

async function findAllTree(req: Request, res: Response) {

    let trees = await TreeModel.findAll();

    successResponse(res, trees);
}

export default async function (req: Request, res: Response) {
    try {
        await findAllTree(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
