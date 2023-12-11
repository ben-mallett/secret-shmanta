import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!)
        const conn = mongoose.connection;

        conn.on("connected", () => {
            console.log("mongodb connected successfully");
        })

        conn.on("error", (err) => {
            console.log(`Mongo db connection error: ${err}`)
        })
    } catch (error) {
        console.log(error);
    }
}