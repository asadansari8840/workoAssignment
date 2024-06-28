import 'reflect-metadata';
import {config} from 'dotenv';
import {container} from 'tsyringe';
import {ConnectDb} from './config/connect-db-config';
import ExpressApp from './app';
config();

async function main() {
    const dbConnect = container.resolve(ConnectDb);
    await dbConnect.connectToMongo();
    const expressApp = container.resolve(ExpressApp);
    expressApp.runApp();
}

main();