const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose')
const Message = require('./Schema/chathelp')
const dotenv = require('dotenv');
const { Socket } = require('dgram');

dotenv.config();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
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
    });
});


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.wto2koe.mongodb.net/chathelp`)
    .then(() => {
        console.log("database connected successfullly!");
        server.listen(3001, () => {
            console.log("started on port 3001")
        })
    })
    .catch((err) => {
        console.log(err);
    })
