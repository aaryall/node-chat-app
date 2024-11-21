import mongoose from "mongoose";

// export const chatSchema = new mongoose.Schema({
//     username : String,
//     messages : [
//         {type : String}

//     ],
//     timestamp : Date
// });


export const chatSchema = new mongoose.Schema({
    createBy: {
        type: String,
        required: true, // Ensures this field is mandatory
        trim: true // Removes leading/trailing whitespace
    },
    messages: [
        {
            message: {
                type: String,
                //required: true // Each message must have text
            },
            username: {
                type: String,
                //required: true // Each message must specify the sender
            },
            timestamp : Date
        }
    ],
    roomid: {
        type: Number,
        unique: true, // Ensures this field is unique
        required: true // Ensures this field is mandatory
    }
    
 });







export const chatModel = mongoose.model('Chat', chatSchema);