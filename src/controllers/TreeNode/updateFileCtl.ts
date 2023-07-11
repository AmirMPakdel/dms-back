import { Request, Response } from "express";
import { BaseError } from "sequelize";
import {
    IEResponse,
    codeResponse,
    statusList,
    successResponse,
} from "../../utils/AppResponse";
import Log from "../../utils/Log";
import TreeNodeModel from "../../models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";
import { mimTypeToExt } from "@/utils/FileUtil";
import fs from "node:fs/promises";
import SharedNodeModel from "@/models/SharedNodeMdl";

async function updateFileCtl(req: Request, res: Response) {
    //TODO: check inputs
    const { file_id, name } = req.body;

    const file = req.file;

    let tree_id = req.currentUser?.tree_id;

    let node = await TreeNodeModel.findOne({
        where: {
            file_id,
            tree_id,
        },
    });

    if (!node) {
        codeResponse(res, statusList.OBJECT_NOT_FOUND, {
            message: `node file_id=${file_id} not found`,
        });
        return;
    }

    let db_file = await FileModel.findOne({
        where: {
            id: node.file_id,
        },
    });

    if (!db_file) {
        codeResponse(res, statusList.OBJECT_NOT_FOUND, {
            message: `file id=${file_id} not found`,
        });
        return;
    }

    db_file.name = name;

    if (db_file.type != "folder" && file) {

        let file_ext = mimTypeToExt(file.mimetype);

        await SharedNodeModel.update({
            file_name:name,
            file_ext:file_ext,
        }, {where:{
            file_id: db_file.id,
        }});

        try {
            await fs.unlink("files/" + db_file.id + "." + db_file.ext);

            db_file.ext = file_ext;
            db_file.type = file_ext;

            await fs.rename(
                file.path,
                "files/" + db_file.id + "." + db_file.ext
            );
        } catch (e) {
            IEResponse(res, { message: (e as BaseError).message });
            return;
        }
    }

    db_file = await db_file.save();

    successResponse(res, {
        file: db_file.toJSON(),
        message: "file edited successfuly!",
    });
}

export default async function (req: Request, res: Response) {
    try {
        await updateFileCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
