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
    //check inputs
    // const { file_id } = req.body;

    // const tree_id = req.currentUser?.tree_id;

    // const username = req.currentUser?.username;

    let filePath = "files/" + req.query["file_id"] + "." + req.query["file_ext"];
    // var filePath = '.' + request.url;
    // if (filePath == './')
    //     filePath = './index.html';

    //var extname = "pdf";//path.extname(filePath);
    let contentType = 'application/pdf';
    // switch (extname) {
    //     case '.js':
    //         contentType = 'text/javascript';
    //         break;
    //     case '.css':
    //         contentType = 'text/css';
    //         break;
    //     case '.json':
    //         contentType = 'application/json';
    //         break;
    //     case '.png':
    //         contentType = 'image/png';
    //         break;      
    //     case '.jpg':
    //         contentType = 'image/jpg';
    //         break;
    //     case '.wav':
    //         contentType = 'audio/wav';
    //         break;
    // }

    let content = await fs.readFile(filePath);

    res.writeHead(200, { 
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="file.pdf"`
     });

    res.end(content, 'utf-8');

    // fs.readFile(filePath, function(error, content) {
    //     if (error) {
    //         if(error.code == 'ENOENT'){
    //             fs.readFile('./404.html', function(error, content) {
    //                 response.writeHead(200, { 'Content-Type': contentType });
    //                 response.end(content, 'utf-8');
    //             });
    //         }
    //         else {
    //             response.writeHead(500);
    //             response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
    //             response.end(); 
    //         }
    //     }
    //     else {
    //         response.writeHead(200, { 'Content-Type': contentType });
    //         response.end(content, 'utf-8');
    //     }
    // });

    //res.send("ok");
}

async function sendMd(req: Request, res: Response) {

    const { file_id, file_ext } = req.query;

    let htm_content = await mdRenderer("files/" + file_id + "." + file_ext);

    // let md_content = await fs.readFile("files/" + file_id + "." + file_ext, { encoding: "utf-8" });

    // let md = new MarkdownIt();

    // let htm_content = md.render(md_content);

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
