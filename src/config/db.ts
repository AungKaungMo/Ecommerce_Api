import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async() => {
    console.log(ENV.DATABASE_URL, 'DBURL')
    try {
        const conn = await mongoose.connect(ENV.DATABASE_URL!)
        console.log("MONGO DB is connecting", conn.connection.host)
    } catch (error) {
        console.log("Can't connect mongodb", error)
        process.exit(1)
    }
}