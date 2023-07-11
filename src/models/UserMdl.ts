import { DataTypes, Model, ModelAttributes } from "sequelize";


export default class UserModel extends Model{

    declare id: number;
    declare username: string;
    declare tree_id: number;
    declare firstname: string;
    declare lastname: string;
    declare national_code: string;
    declare token: string;
    declare password: string;
    declare sso_token: string;

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
        national_code:{
            type: DataTypes.STRING(10),
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
        sso_token: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    };
}