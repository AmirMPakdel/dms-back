import { DataTypes, Model, ModelAttributes } from "sequelize";


export default class SharedNodeModel extends Model{

    declare id: number;
    declare node_id: number;
    declare file_id: number;
    declare user_id: number;
    declare owner_id: number;
    declare name: string;
    declare ext: string;
    declare privileges: string;

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
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        owner_id:{
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        ext:{
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        privileges:{
            type: DataTypes.STRING(10),
            allowNull: false,
        }
    };
}
