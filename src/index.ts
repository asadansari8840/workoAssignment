import 'module-alias/register';
import 'reflect-metadata';
import {config} from 'dotenv';
config();
import {container} from 'tsyringe';
import {ConnectDb} from '@config/connect-db-config';
import ExpressApp from '@app';

async function main() {
    const dbConnect = container.resolve(ConnectDb);
    await dbConnect.connectToMongo();
    const expressApp = container.resolve(ExpressApp);
    expressApp.runApp();
}

main();