import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Connected to Database")
        return
    }
    try {
        console.log("Mongo URI:", process.env.MONGODB_URI);
        const db = await mongoose.connect(process.env.MONGODB_URI ||"",)
        connection.isConnected = db.connections[0].readyState
        console.log("Database Connect Success")

    } catch (error) {
        console.log("Db not connected", error)
        //  process.exit(1)
        throw new Error("Database connection failed")
    }
}
export default dbConnect