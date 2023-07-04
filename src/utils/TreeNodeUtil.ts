import TreeNodeModel from "@/models/TreeNodeMdl";

export default class TreeNodeUtil {
    public static combineTreeNodesTags = async (treeNodes: TreeNodeModel[]) => {
        // if (!treeNodes.length) {
        //     return null;
        // }

        // let tags = await TagModel.findAll();

        // let treeId = treeNodes[0].tree_id;

        // let treeNodeTags = await TreeNodeTagModel.findAll({
        //     where: { tree_id: treeId },
        // });

        // treeNodeTags.forEach((tnt) => {
        //     tags.forEach((tag) => {
        //         if (tnt.tag_id === tag.id) {
        //             tnt.tag = tag.toJSON();
        //         }
        //     });
        // });

        // treeNodes.forEach((tn) => {
        //     treeNodeTags.forEach((tnt) => {
        //         if (tnt.node_id === tn.id && tnt.tag) {
        //             if (!tn.dataValues.tags) {
        //                 tn.dataValues.tags = [tnt.tag];
        //             }else {
        //                 tn.dataValues.tags.push(tnt.tag);
        //             }
        //         }
        //     });
        // });

        return treeNodes;
    };

    public static combineEmployeeTreeNodes = async (
        treeNodes: TreeNodeModel[]
    ) => {
        // if (!treeNodes.length) {
        //     return null;
        // }
        // let employees = await EmployeeModel.findAll();

        // treeNodes.forEach((tn) => {
        //     for (let i = 0; i < employees.length; i++) {
        //         if (employees[i].id === tn.employee_id) {
        //             tn.dataValues.employee = employees[i].toJSON();
        //             employees.splice(i, 1);
        //             break;
        //         }
        //     }
        // });

        return treeNodes;
    };
}
