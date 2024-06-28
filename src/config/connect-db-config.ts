import mongoose from 'mongoose';
import {singleton} from 'tsyringe';

@singleton()
export class ConnectDb {
    public connectToMongo = async () => {
        mongoose.connect(process.env.MONGO_URI as string).then((conn) => {
            console.log(`Connected to MongoDB: ${conn.connection.host}`);
        });
    };
}
