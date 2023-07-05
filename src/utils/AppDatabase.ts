import { BaseError, Sequelize } from "sequelize";
import TreeModel from "@/models/TreeMdl";
import UserModel from "@/models/UserMdl";
import TreeNodeModel from "@/models/TreeNodeMdl";
import env from "@/env";
import FileModel from "@/models/FileMdl";
import AccessLinkModel from "@/models/AccessLinkMdl";
import SharedNodeModel from "@/models/SharedNodeMdl";

class AppDatabase {
    private static Models = [
        FileModel,
        TreeModel,
        TreeNodeModel,
        UserModel,
        AccessLinkModel,
        SharedNodeModel,
    ];

    private static singleton: AppDatabase;

    private sequelize: Sequelize;

    private constructor() {
        this.sequelize = new Sequelize({
            sync: {alter:true, force:false},
            dialect: env.DB_DIALECT,
            host: env.DB_HOST,
            database: env.DB_NAME,
            username: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            timezone: env.DB_TIMEZONE,
            logging: (env.DB_LOGGING=="true"),
        });
    }

    public static init(): Promise<AppDatabase_init_Promise> {
        return new Promise(async (resovle) => {
            if (!AppDatabase.singleton) {
                AppDatabase.singleton = new AppDatabase();
            }

            AppDatabase.Models.forEach((M) => {
                
                M.init(M.model_atrributes, {
                    modelName: M.model_name,
                    sequelize: AppDatabase.singleton.sequelize,
                });
            });

            try {
                await this.singleton.sequelize.sync({ alter: true });

                resovle({ res: true, error: null });
            } catch (e) {
                if (e instanceof BaseError) {
                    resovle({ res: null, error: e.message });
                } else {
                    resovle({ res: null, error: e });
                }
            }
        });
    }

    public static getDB() {
        return AppDatabase.singleton;
    }

    getSequelize(): Sequelize {
        return this.sequelize;
    }

    getModels() {
        return this.sequelize.models;
    }
}

export default AppDatabase;
