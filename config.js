import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.DB_URL;
export const connectToDatabase = async ()=>{
    await mongoose.connect(url,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    });
    console.log('DB is connected');
}