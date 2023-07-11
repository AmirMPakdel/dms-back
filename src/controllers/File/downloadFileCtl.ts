import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse } from "@/utils/AppResponse";
import Log from "@/utils/Log";
import AccessLinkModel from "@/models/AccessLinkMdl";
import FileModel from "@/models/FileMdl";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";

async function downloadFileCtl(req: Request, res: Response) {

    const { file_id } = req.query;

    console.log(file_id);

    let tree_id = req.currentUser?.tree_id;

    let username = req.currentUser?.username;

    console.log(username);
    
    console.log(req.headers);

    const range = req.headers.range;

    // if (!range) {
    //     res.status(404).send("Requires Range header!");
    //     return;
    // }

    let file = await FileModel.findOne({where:{
        id: file_id
    }});

    if(!file){

        res.status(404).send("File Not Found!");
        return;
    }

    const filePath = "files/" + file.id + "." + file.ext;
    
    const fileStat = await fs.stat(filePath);
    const fileSize = fileStat.size;

    const CHUNK_SIZE = 10 ** 6;
    const start = range?Number(range.replace(/\D/g, "")):0;
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
    let contentLength = end - start + 1;

    const headers:any = {
        "Accept-Ranges": "bytes",
        "Content-Length": range?contentLength:fileSize,
        "Content-Type": "application/octet-stream",//getContentType(file.ext),
        //'Content-Disposition': `attachment; filename="${file.name}.${file.ext}"`,
        "Content-Disposition": "attachment;",
    };

    if(start > end){

        res.status(404).send("Range Not Valid!");
        return;
    }

    if(range){

        headers["Content-Range"] = `bytes ${start}-${end}/${fileSize}`;
        
        res.writeHead(206, headers);

        console.log("start:"+start+", end:"+end);
        
        const fileStream = createReadStream(filePath, { start, end });

        fileStream.pipe(res);

    }else{

        res.writeHead(200, headers);

        const fileStream = createReadStream(filePath);

        fileStream.pipe(res);
    }
}


export default async function (req: Request, res: Response) {
    try {
        await downloadFileCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}

function getContentType(ext:string){

    switch (ext) {
        case 'md':
            return 'application/md';
        case 'pdf':
            return 'application/pdf';
        case 'png':
            return 'image/png';
        case 'jpg':
            return 'image/jpg';
        case 'mp4':
            return 'mpeg/mp4';
    }
    return "application/octet-stream";
}