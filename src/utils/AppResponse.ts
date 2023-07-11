import { Response } from "express";

export const statusList = {

    SUCCESS:{"code":2000 },
    INTERNAL_ERROR:{"code":5000, "error":"INTERNAL_ERROR" },
    OBJECT_NOT_FOUND:{"code":4000, "error":"OBJECT_NOT_FOUND"},
    AUTH_FAILED: {code: 3001, error:"AUTH_FAILED"},
    WRONG_CREDENTIAL: {code: 3002, error:"WRONG_CREDENTIAL"},
    INPUT_NOT_FOUND: {code:3003, error:"INPUT_NOT_FOUND"},
}

export function successResponse(res : Response, body : any){

    res.json({
        rc: statusList.SUCCESS.code,
        data: body
    });
}

export function IEResponse(res : Response, body : any){

    res.json({
        rc: statusList.INTERNAL_ERROR.code,
        error: statusList.INTERNAL_ERROR.error,
        data: body
    });
}

export function codeResponse(res : Response, status: ResponseCode, body : any){
    
    res.json({
        rc: status.code,
        data: body
    });
}