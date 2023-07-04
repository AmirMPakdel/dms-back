import { DataTypes, Model, ModelAttributes } from "sequelize";


export default class UserModel extends Model{

    declare id: number;
    declare username: string;
    declare tree_id: number;
    declare token: string;
    declare password: string;

    public static model_name = "User";

    public static model_atrributes:ModelAttributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        tree_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        firstname:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };
}