import TreeNodeModel from "@/models/TreeNodeMdl";
import TreeNodeUtil from "./TreeNodeUtil";

export default class TreeUtil {

    public static getTreeNodesById = async (treeId: number) => {
        let nodes = await TreeNodeModel.findAll({
            where: { tree_id: treeId },
        });

        return nodes;
    };

    public static findNearestUpperLevelTag = async (
        tag_id: number,
        treeNodes: TreeNodeModel[],
        treeNodeId: number
    ): Promise<null | TreeNodeModel> => {
        let mTreeNodes = await TreeNodeUtil.combineTreeNodesTags(treeNodes);
        if (mTreeNodes == null) {
            return null;
        }
        let selectedNode: TreeNodeModel | any;
        mTreeNodes.forEach((tn) => {
            if (treeNodeId === tn.id) {
                selectedNode = tn;
            }
        });
        if (!selectedNode) {
            return null;
        }
        let targetNode: null | TreeNodeModel = null;
        let currentNode: null | TreeNodeModel = selectedNode;
        let currentNodeParent: null | TreeNodeModel = null;

        while (currentNode?.parent_id !== 0 && targetNode == null) {

            mTreeNodes.forEach((tn) => {

                if (currentNode?.parent_id === tn.id && targetNode == null) {

                    currentNodeParent = tn;
                    if (tn.dataValues.tags && tn.dataValues.tags.length) {

                        tn.dataValues.tags.forEach((tag:any) => {
                            
                            if (tag_id === tag.id) {
                                targetNode = tn;
                            }
                        });
                    }
                }
            });
            if (targetNode != null) {
                break;
            } else {
                currentNode = currentNodeParent;
            }
        }
        return targetNode;
    };

    public static getSubtreeNodes = async (
        treeNodes: TreeNodeModel[],
        treeNodeId: number
    ) => {
        let root;
        let currentNodes: Array<TreeNodeModel> = [];
        treeNodes.forEach((tn) => {
            if (tn.id === treeNodeId) {
                root = tn;
            }
            if (tn.parent_id === treeNodeId) {
                currentNodes.push(tn);
            }
        });
        if (!root) {
            return null;
        }
        let subTreeNodes: Array<TreeNodeModel> = [root];
        subTreeNodes = subTreeNodes.concat(currentNodes);
        let next_gen_currentNodes: Array<TreeNodeModel> = [];
        while (currentNodes.length != 0) {
            treeNodes.forEach((tn) => {
                currentNodes.forEach((cn) => {
                    if (tn.parent_id === cn.id) {
                        next_gen_currentNodes.push(tn);
                    }
                });
            });
            subTreeNodes = subTreeNodes.concat(next_gen_currentNodes);
            currentNodes = next_gen_currentNodes;
            next_gen_currentNodes = [];
        }
        return subTreeNodes;
    };
}
