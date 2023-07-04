import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "../../utils/AppResponse";
import Log from "../../utils/Log";
import TreeNodeModel from "../../models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";
import { log } from "console";
import fs from "node:fs/promises";
import { mimTypeToExt } from "@/utils/FileUtil";
import path from "node:path";

async function uploadFileCtl(req: Request, res: Response) {
    //TODO: check inputs
    const { name, type, parent_id } = req.body;

    console.log("token "+req.body.token);
    

    const tree_id = req.currentUser?.tree_id;

    log("tree_id "+tree_id);

    const file = req.file;

    //TODO: change
    log(file);
    if (!file) {
        successResponse(res, {
            name,
            type,
            parent_id,
            file: file,
        });
        return;
    }

    let file_ext = mimTypeToExt(file.mimetype);

    //create File
    let newFile = new FileModel({
        name,
        type,
        size: file.size,
        ext: file_ext,
    });

    newFile = await newFile.save();

    //create Node
    let newTreeNode = new TreeNodeModel({
        tree_id,
        parent_id,
        file_id: newFile.id,
        name,
    });

    newTreeNode = await newTreeNode.save();

    try {
        await fs.rename(file.path, "files/" + newFile.id + "." + file_ext);
    } catch (e) {
        IEResponse(res, { message: (e as BaseError).message });
        return;
    }

    //response succes
    successResponse(res, {
        node: newTreeNode.toJSON(),
        file: newFile.toJSON(),
    });
}

export default async function (req: Request, res: Response) {
    try {
        await uploadFileCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
