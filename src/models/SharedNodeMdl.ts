import { DataTypes, Model, ModelAttributes } from "sequelize";


export default class SharedNodeModel extends Model{

    declare id: number;
    declare node_id: number;
    declare file_id: number;
    declare username: string;
    declare owner_id: number;
    declare file_name: string;
    declare file_ext: string;
    declare deletable: boolean;
    declare can_update: boolean;
    declare can_rename: boolean;
    
    public static model_name = "SharedNode";

    public static model_atrributes:ModelAttributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        node_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        file_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        owner_id:{
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        file_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_ext:{
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        deletable:{
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        can_update:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        can_rename:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    };
}
