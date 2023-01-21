import mongoose from 'mongoose';
import { environment } from '../config/env';

export const connect = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(`mongodb+srv://${environment.USER}:${environment.PASSWORD}@${environment.CLUSTER_NAME}.dw9jl.mongodb.net/${environment.DATABASE_NAME}?retryWrites=true&w=majority`);
        console.log(`Connect to ${mongoose.connection.name}`);
    } catch (error) {
        console.log(error);
    }
}
