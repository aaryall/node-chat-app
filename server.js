import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { chatModel } from './chat.Schema.js';
export const app = express();
app.use(cors());

export const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});


    io.on("connection", (socket) => {
        console.log("Connection made.");
    
        socket.on("join", async (data) => {
            try {
                const joiningText = data.username + " has joined the room."
                const newMessageData = {
                    username : data.username,
                    message : joiningText,
                    timestamp : new Date()
        
                }
                const result = await chatModel.findOneAndUpdate(
                    { roomid : data.room }, // Filter by room ID
                    {
                        $push: { messages: newMessageData }, // Push the new message into messages array
                        $setOnInsert: { createBy: data.username, roomid : data.room  } // Set these fields if creating a new record
                    },
                    { upsert: true, new: true } // Create if not found, return updated document
                );
                //Load Old  Mesage if joined exisiting room
                chatModel.find({roomid : data.room})
                          .then(oldData=>{
                           // Sort messages by timestamp in ascending order
                        //    console.log(oldData[0].messages);
                           const sortedMessages = oldData[0]?.messages?.sort((a, b) => {
                            return new Date(a.timestamp) - new Date(b.timestamp);
                        });
            
                            // Limit to 50 messages
                            const limitedMessages = sortedMessages?.slice(0, 50);
                            socket.emit('load_messages',limitedMessages);
                            console.log("limitedMessages",limitedMessages);
                        }).catch(err=>{
                            console.log(err);
                        })
                // Emit a welcome message to the user who joined
                socket.emit("message", { text: `Welcome, ${data.username}!` });
                
                // Broadcast a message to all other users in the same room
                socket.broadcast.to(data.room).emit("message", {
                    text: `${data.username} has joined the room.`
                });
        
                // Join the room
                socket.join(data.room);
            } catch (error) {
                console.log('Something went wrong',error);
            }
            
        });
    
         socket.on("sendMessage", async (data) => {
            // Broadcast the received message to all users in the same room
            // Check if the room exists and add the message to the room
            try {
                const newMessageData = {
                    username : data.username,
                    message : data.message,
                    timestamp : new Date()
        
                }
                const result = await chatModel.findOneAndUpdate(
                    { roomid: data.room }, // Filter by room ID
                    {
                        $push: { messages: newMessageData }, // Push the new message into messages array
                        $setOnInsert: { createBy: data.username, roomid: data.room }, // Set these fields if creating a new record
                    },
                    { upsert: true, new: true } // Create if not found, return updated document
                );
                io.to(data.room).emit("message", {
                    username: data.username,
                    text: data.message
                });
            } catch (error) {
                console.log('Something went wrong',error);
            }
            
        });
    
        socket.on("disconnect", () => {
            console.log("Connection disconnected.");
        });
    }); 






