// import { faker } from '@faker-js/faker/locale/fa';
// import { faker as faker_en } from '@faker-js/faker/locale/en';
// import EmployeeSeeder from './EmployeeSeeder';
// import TreeNodeSeeder from './TreeNodeSeeder';
// import { randomInt } from 'crypto';

// export default class TreeSeeder{

//     static async createTree(nodes_number:number, max_children:number, min_children:number){

//         let tree_id = 1;

//         let employee = await EmployeeSeeder.createEmployee();

//         let node_n = nodes_number;

//         let treeNode = await TreeNodeSeeder.createTreeNode(tree_id, 0, employee.id);

//         node_n--;

//         let nodes = [treeNode];
//         let selected_node = treeNode;
//         let selected_node_index = 0;
//         let selected_node_children_count = 2//randomInt(min_children, max_children);

//         while(node_n>0){

//             if(selected_node_children_count){

//                 employee = await EmployeeSeeder.createEmployee();

//                 treeNode = await TreeNodeSeeder.createTreeNode(tree_id, selected_node.id, employee.id);

//                 nodes.push(treeNode);

//                 selected_node_children_count--;
//                 node_n--;

//             }else{

//                 selected_node_index++;

//                 if(nodes[selected_node_index]){
//                     selected_node = nodes[selected_node_index];
//                     selected_node_children_count = 2//randomInt(min_children, max_children);
//                 }
//             }
//         }

//         return nodes;
//     }
// }