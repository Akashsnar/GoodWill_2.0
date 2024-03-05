const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
        },
    name: { type: String, trim: true},
    Email: {type: String, trim: true},
    profilePic: { type: String, default: "img.png"},
    phone:{type: String },
    dob: {type: String, trim: true},
    gender: {type: String, trim: true},
    details: {type: String, trim: true,  default: "No detail"},
    volunteerNgosCampaign:  [String]

},{timestamps: true});

var User = mongoose.model('Userdetail', UserSchema);
module.exports = User;
