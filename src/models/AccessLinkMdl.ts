import { DataTypes, Model, ModelAttributes } from "sequelize";


export default class AccessLinkModel extends Model{

    declare id: number;
    declare file_id: string;
    declare type: string;
    declare uuid: string;
    
    public static model_name = "AccessLink";

    public static model_atrributes:ModelAttributes = {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        file_id:{
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        type:{
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        uuid:{
            type: DataTypes.STRING(48),
            allowNull: false,
        }
    };
}