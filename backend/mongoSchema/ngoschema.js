const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ngoSchema = new Schema({
    // firstName: { type: String, required: true, trim: true },
    // lastName: { type: String, required: true, trim: true },

    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, require: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "Logo.png" },
    registrationproof:{type: String,trim:true,unique:true,required:true}
   },{timestamps: true});

var Ngo = mongoose.model('Ngoregister', ngoSchema);
module.exports = Ngo;
//schema