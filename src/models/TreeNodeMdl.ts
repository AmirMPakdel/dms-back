import { DataTypes, Model, ModelAttributes } from "sequelize";
import FileModel from "./FileMdl";


export default class TreeNodeModel extends Model{

    declare id: number;

    declare tree_id: number;

    declare parent_id: number;

    declare file_id: number;

    declare file: FileModel|null;

    declare name: string;

    public static model_name = "TreeNode";

    public static model_atrributes:ModelAttributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tree_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        parent_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        file_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    };
}
