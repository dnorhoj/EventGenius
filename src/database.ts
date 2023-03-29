import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: process.env.DEBUG === 'true',
    entities: [
        __dirname + '/models/*.ts',
    ],
});

AppDataSource.initialize();