import mongoose from "mongoose";



export const connectToDatabase = async ()=>{
    await mongoose.connect("mongodb://localhost:27017/chapApp",{
        useNewUrlParser : true,
        useUnifiedTopology : true
    });
    console.log('DB is connected');
}