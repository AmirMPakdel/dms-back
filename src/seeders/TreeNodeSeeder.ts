// import EmployeeModel from '@/models/Employee.mdl';
// import { faker } from '@faker-js/faker/locale/fa';
// import { faker as faker_en } from '@faker-js/faker/locale/en';
// import TreeNodeModel from '@/models/TreeNodeMdl';

// export default class TreeNodeSeeder{

//     static async createTreeNode(tree_id:number, parent_id:number, employee_id:number){

//         let treeNode = new TreeNodeModel({

//             tree_id,
//             parent_id,
//             employee_id,
//             title: faker.name.jobTitle()
//         });

//         treeNode = await treeNode.save();

//         return treeNode;
//     }
// }