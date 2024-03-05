//reviewSchema.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    author: { type: String, required: true, trim: true },
    ngoname: { type: String, required: true, trim: true },
    campagainname: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

var review = mongoose.model("reviews", reviewSchema);
module.exports = review;
