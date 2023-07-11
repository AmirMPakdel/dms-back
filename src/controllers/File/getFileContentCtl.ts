import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, successResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import fs from "node:fs/promises";
import { mdRenderer } from "@/utils/MdRenderer";

async function getFileContentCtl(req: Request, res: Response) {

    const { file_id, file_ext } = req.query;

    switch (file_ext) {
        case "pdf":
            sendPdf(req, res);
            break;
        case "md":
            sendMd(req, res);
            break;
    }
}

async function sendPdf(req: Request, res: Response) {

    let filePath = "files/" + req.query["file_id"] + "." + req.query["file_ext"];

    let contentType = 'application/pdf';

    let content = await fs.readFile(filePath);

    res.writeHead(200, { 
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="file.pdf"`
     });

    res.end(content, 'utf-8');

}

async function sendMd(req: Request, res: Response) {

    const { file_id, file_ext } = req.query;

    let htm_content = await mdRenderer("files/" + file_id + "." + file_ext);


    successResponse(res, { htm_content });
}

export default async function (req: Request, res: Response) {
    try {
        await getFileContentCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
