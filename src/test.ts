import AppDatabase from "@/utils/AppDatabase";

AppDatabase.init();


const db = AppDatabase.getDB();

// TreeSeeder.createTree(500, 0, 3).then((nodes=>{
//     console.log(nodes);
// }));
