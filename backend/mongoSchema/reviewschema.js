const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    ngoname: { type: String, required: true, trim: true},
    username: { type: String, required: true, trim: true},
    rating: {type: Number, required: true},
    comment: { type: String, required: true }
},{timestamps: true});


var review = mongoose.model('reviews',  reviewSchema);
module.exports = review;