import { Request, Response } from "express";
import { BaseError } from "sequelize";
import {
    IEResponse,
    codeResponse,
    statusList,
    successResponse,
} from "@/utils/AppResponse";
import Log from "@/utils/Log";
import TreeNodeModel from "@/models/TreeNodeMdl";
import TreeModel from "@/models/TreeMdl";

async function _delete(req: Request, res: Response) {
    //TODO: check inputs
    const { tree_id } = req.body;

    let deleted_nodes = await TreeNodeModel.destroy({
        where: { tree_id },
    });

    if (!deleted_nodes) {
        codeResponse(res, statusList.OBJECT_NOT_FOUND, {
            tree_id,
            deleted_nodes,
        });
        return;
    }

    let deleted_trees = await TreeModel.destroy({
        where: {id:tree_id}
    });

    if (!deleted_trees) {
        codeResponse(res, statusList.OBJECT_NOT_FOUND, {
            tree_id,
            deleted_trees,
        });
        return;
    }

    successResponse(res, {deleted_trees});
}

export default async function (req: Request, res: Response) {
    try {
        await _delete(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
