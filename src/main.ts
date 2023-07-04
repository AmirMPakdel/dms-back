import express from "express";
import env from "./env";
import AppDatabase from "@/utils/AppDatabase";
import Log from "@/utils/Log";
import cors from "cors";
import multer from "multer";
import signupUserCtl from "./controllers/User/signupUserCtl";
import cookieSession from "cookie-session"
import loginUserCtl from "./controllers/User/loginUserCtl";
import createFolderCtl from "./controllers/TreeNode/createFolderCtl";
import { currentUser } from "./middlewares/currentUserCtl";
import getAllFilesInFolderCtl from "./controllers/File/getAllFilesInFolderCtl";
import getAllFileInPrvFolderCtl from "./controllers/File/getAllFileInPrvFolderCtl";
import uploadFileCtl from "./controllers/TreeNode/uploadFileCtl";
import getFileContentCtl from "./controllers/File/getFileContentCtl";
import getFilePublicUrlCtl from "./controllers/File/getFilePublicUrlCtl";
import getFileFromAccessLinkCtl from "./controllers/File/getFileFromAccessLinkCtl";
import deleteFileCtl from "./controllers/TreeNode/deleteFileCtl";

interface runServer_promise{

    error: string|null,
    res: express.Express|null,
}

async function runServer():Promise<runServer_promise>{

    return new Promise(async(resolve)=>{

        try{

            const db_init_res = await AppDatabase.init();

            if(db_init_res.error){

                Log.e(db_init_res.error);
                return;
            }

            const app = express();

            app.set("trust proxy", true);
            app.use(cookieSession({
                signed: false,
                secure: true,
            }))

            const corsConf:cors.CorsOptions = {
                origin:[
                    "http://localhost:3000",
                    "http://localhost:5080",
                ]
            };

            app.use(cors(corsConf));
            app.use(express.urlencoded({extended:true}));
            app.use(express.json());
            const upload = multer({ dest: "uploads_temp/" });
            
            app.get("/test", (req,res)=>{res.send("server is up and reachable!")});

            app.post("/api/user/signup", signupUserCtl);
            app.post("/api/user/login", loginUserCtl);
            
            app.post("/api/dash/createFolder", currentUser, createFolderCtl);
            app.post("/api/dash/getAllFilesInFolder", currentUser, getAllFilesInFolderCtl);
            app.post("/api/dash/getAllFileInPrvFolder", currentUser, getAllFileInPrvFolderCtl);
            app.post("/api/dash/uploadFile", upload.single("file"), currentUser, uploadFileCtl);
            
            app.get("/api/file/serve", getFileContentCtl);
            app.post("/api/file/getPublicUrl", currentUser, getFilePublicUrlCtl);
            app.get("/api/file/getFileFromAccessLink/:uuid", getFileFromAccessLinkCtl);
            app.post("/api/file/delete", currentUser, deleteFileCtl)
            
            app.listen(env.SERVER_PORT,()=>{

                resolve({error:null, res:app});
            });

        }catch(error:any){

            resolve({error:error.message, res:null});
        }
    });
}

export default runServer;