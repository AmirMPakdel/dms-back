import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse, codeResponse, statusList } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import AccessLinkModel from "@/models/AccessLinkMdl";
import FileModel from "@/models/FileMdl";
import fs from "node:fs/promises";

async function getFileFromAccessLinkCtl(req: Request, res: Response) {

    const { uuid } = req.params;

    let accessLink = await AccessLinkModel.findOne({
        where: {
            uuid,
            type: "public",
        }
    });

    if(!accessLink){

        res.status(404).send("File Not Found!");
        return;
    }

    let file = await FileModel.findOne({where:{
        id: accessLink.file_id
    }});

    if(!file){

        res.status(404).send("File Not Found!");
        return;
    }

    let filePath = "files/" + file.id + "." + file.ext;

    let contentType = 'application/md';

    switch (file.ext) {
        case 'pdf':
            contentType = 'application/pdf';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        case 'jpg':
            contentType = 'image/jpg';
            break;
        case '.mp4':
            contentType = 'mpeg/mp4';
            break;
    }

    let content = await fs.readFile(filePath);

    res.writeHead(200, { 
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${file.name}.${file.ext}"`
     });

    res.end(content, 'utf-8');

    return;
}


export default async function (req: Request, res: Response) {
    try {
        await getFileFromAccessLinkCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
