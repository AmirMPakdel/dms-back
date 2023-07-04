import { DataTypes, Model, ModelAttributes } from "sequelize";


export default class TreeModel extends Model{

    declare id: number;
    declare user_id: number;
    declare root_id: number;

    public static model_name = "Tree";

    public static model_atrributes:ModelAttributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        root_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    };
}