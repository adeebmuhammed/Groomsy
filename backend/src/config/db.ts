import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string)
        console.log("MongoDb connected");
    } catch (error) {
        console.log("error while connecting to the database", error);
        throw error;
    }
}