// import { Request, Response } from "express";
// import { BaseError } from "sequelize";
// import { IEResponse, successResponse } from "@/utils/AppResponse";
// import Log from "@/utils/Log";
// import MansabTagModel from "@/models/Mansab.mdl";

// async function createPermissionController(req: Request, res: Response) {
//     //check inputs
//     const { title } = req.body;

//     let newPermission = new MansabTagModel({
//         title,
//     });

//     try {
//         newPermission = await newPermission.save();
//     } catch (e) {
//         IEResponse(res, { message: (e as BaseError).message });
//         return;
//     }

//     successResponse(res, newPermission.toJSON());
// }


// export default async function(req: Request, res: Response) {

//     try{

//         await createPermissionController(req, res);

//     }catch(e){

//         Log.e("catched outside!->"+(e as BaseError).message);

//         IEResponse(res, { message: (e as BaseError).message });
//     }
// }