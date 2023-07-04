import path from "path";
import fs from "node:fs/promises";

export function createRequiredDirs(){

    return new Promise<void>(async(resolve)=>{

        try{
            await fs.mkdir("files");
        }catch(e){
            //do nothing
        }
        try{
            await fs.mkdir("uploads_temp");
        }catch(e){
            //do nothing
        }
        resolve();
    });
}

export function mimTypeToExt(mim:string){

    if(mim == "application/md"){
        return "md";
    }else if(mim == "application/pdf"){
        return "pdf";
    }else if(mim == "image/jpeg"){
        return "jpg";
    }else if(mim == "image/png"){
        return "png";
    }else if(mim == "image/gif"){
        return "gif";
    }else if(mim == "video/mp4"){
        return "mp4";
    }
    return "md";
}

export function getRootDir(){

    return path.resolve("D:\\projects\\dms-back");
}