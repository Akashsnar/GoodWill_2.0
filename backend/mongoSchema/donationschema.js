const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema(
  {
    username: { type: String, required: true, trim: true},
    userid: { type: mongoose.Schema.Types.ObjectId},
    NgoName: { type: String, trim: true },
    campaignName: { type: String, required: true },
    campaignid:{ type: mongoose.Schema.Types.ObjectId},
    donationAmount: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

var Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;