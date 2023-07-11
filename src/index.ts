import env from "./env";
import runServer from "./main";
// import {replaceTscAliasPaths} from "tsc-alias";

// replaceTscAliasPaths({
//     resolveFullPaths:true,
// })

runServer().then(({error, res})=>{

    if(error){

        console.log(error);

    }else{

        console.log("Server is up and running on port "+env.SERVER_PORT);
    }
});