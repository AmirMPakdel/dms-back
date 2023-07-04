import env from "./env";
import runServer from "./main";

runServer().then(({error, res})=>{

    if(error){

        console.log(error);

    }else{

        console.log("Server is up and running on port "+env.SERVER_PORT);
    }
});