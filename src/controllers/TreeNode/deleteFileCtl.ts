import { Request, Response } from "express";
import { BaseError } from "sequelize";
import { IEResponse, codeResponse, statusList, successResponse } from "../../utils/AppResponse";
import Log from "../../utils/Log";
import TreeNodeModel from "../../models/TreeNodeMdl";
import FileModel from "@/models/FileMdl";
import fs from "node:fs/promises";
import TreeUtil from "@/utils/TreeUtil";

async function deleteFileCtl(req: Request, res: Response) {
    //TODO: check inputs
    const { file_id } = req.body;

    let tree_id = req.currentUser?.tree_id;

    let file = await FileModel.findOne({where:{
        id: file_id,
    }});

    if(!file){
        codeResponse(res, statusList.OBJECT_NOT_FOUND, {message:`file id=${file_id} not found!`});
        return;
    }

    let node = await TreeNodeModel.findOne({where:{
        file_id: file.id,
        tree_id,
    }});

    if(!node){
        codeResponse(res, statusList.OBJECT_NOT_FOUND, {message:`node file_id=${file_id} not found!`});
        return;
    }

    if(file.type === "folder"){

        //TODO: delete files recursivly

        let tree_nodes = await TreeNodeModel.findAll({where:{
            tree_id
        }});

        let subTree = await TreeUtil.getSubtreeNodes(tree_nodes, node.id);

        if(subTree){

            let node_ids = subTree.map(v=>v.id);

            let file_ids = subTree.map(v=>v.file_id);
    
            let all_files = await FileModel.findAll();
    
            subTree?.forEach((mnode) => {
                all_files.forEach((mfile) => {
                    if (mnode.file_id === mfile.id) {
                        mnode.dataValues.file = mfile.toJSON();
                    }
                });
            });
    
            let file_names = subTree.map(v=>{
                if(v.dataValues.file.type !== "folder"){
                    return (v.dataValues.file?.id+"."+v.dataValues.file?.ext)
                }else{
                    return "null";
                }
            }).filter((v)=>{
                if(v !== "null"){ return true;}
            });
    
            await bulkDeleteFiles(node_ids, file_ids, file_names);
    
            successResponse(res, {subTree, node_ids, file_ids, file_names});
        }

    }else{

        let file_stat = await fs.stat("files/"+file.id+"."+file.ext);

        if(file_stat.isFile()){

            await file.destroy();
            await node.destroy();
            await fs.unlink("files/"+file.id+"."+file.ext);

            successResponse(res, {messsage:"file deleted!"});

        }else{
            codeResponse(res, statusList.OBJECT_NOT_FOUND, {message:`file path=${file.id+"."+file.ext} not found!`});
            return;
        }

    }
}

function bulkDeleteFiles(node_ids:number[], file_ids:number[], file_names:string[]){

    return new Promise<void>(async(resolve)=>{

        await FileModel.destroy({where:{
            id: file_ids
        }});

        await TreeNodeModel.destroy({where:{
            id: node_ids
        }});

        for(const file_name of file_names){

            await fs.unlink("files/"+file_name);
        }

        resolve();
    });
}

export default async function (req: Request, res: Response) {
    try {
        await deleteFileCtl(req, res);
    } catch (e) {
        Log.e("catched outside!->" + (e as BaseError).message);

        IEResponse(res, { message: (e as BaseError).message });
    }
}
