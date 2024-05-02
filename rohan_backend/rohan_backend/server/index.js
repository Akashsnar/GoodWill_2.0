const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose')
const Message = require('./Schema/chathelp')
const dotenv = require('dotenv');
const User = require('../../../backend/mongoSchema/userModel');

dotenv.config();

app.use(cors());

const server = http.createServer(app);

const onlineUsers = new Set();
const userSocketId = new Map();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

const getId = async ({ email }) => {
    console.log(email)
    // const user = await User.findOne({ email: email });
    const user = await User.find();
    console.log(user);
    return user;
}


io.on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);
    console.log(`emailId is ${socket.handshake.query.email}`);
    const userId = await getId({ email: socket.handshake.query.email });
    // const userId = "dsjfdf";
    console.log(userId);
    onlineUsers.add(userId);
    userSocketId.set(userId, socket.id);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", async (data) => {
        try {
            console.log("send_message")
            const newMessage = new Message({
                room: data.room,
                author: data.author,
                message: data.message,
                time: data.time
            });

            await newMessage.save();
            console.log("hi");
            socket.to(data.room).emit("receive_message", data);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        onlineUsers.delete(userId);
        userSocketId.delete(userId);
    });
});

mongoose.connect(`mongodb+srv://aksn0204:aAKgkxCEiyXB5O59@cluster0.dpmnhfa.mongodb.net/GoodWill`)
    .then(() => {
        console.log("database connected successfullly!");
        server.listen(3001, () => {
            console.log("started on port 3001")
        })
    })
    .catch((err) => {
        console.log(err);
    })
