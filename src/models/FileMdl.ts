import { DataTypes, Model, ModelAttributes } from "sequelize";


export default class FileModel extends Model{

    declare id: number;

    declare profile_id: number;

    declare name: string;

    declare type: string;

    declare size: number;

    declare ext: string;

    public static model_name = "File";

    public static model_atrributes:ModelAttributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        size:{
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        ext:{
            type: DataTypes.STRING(10),
            allowNull: true,
        }
    };
}
