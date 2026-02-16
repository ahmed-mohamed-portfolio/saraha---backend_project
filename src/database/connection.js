import mongoose from "mongoose";
import { DB_URL } from "../../config/index.js";



export const databaseConnection = async () => {

    const connection = await mongoose.connect(DB_URL).then(() => {
        console.log("database connected");

    }).catch((err) => {
        console.log(err);

    })
}