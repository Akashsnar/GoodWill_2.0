const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
        content: {
            type: String,
            required: true,
        },
        roomId: {
            type: String,
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

const Message = model("Message", messageSchema);
module.exports = Message;