import mongoose from "mongoose";

process.loadEnvFile();

const connectionString = process.env.MONGO_URI || "";
export const db = mongoose.connect(connectionString, { dbName: 'test-db'})
    .then(() =>
        console.log("Connected to MongoDB")
    ).catch(
        (error) => console.error(error)
    )