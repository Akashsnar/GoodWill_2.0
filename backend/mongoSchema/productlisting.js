const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productlisting = new Schema(
  {
    Username: { type: String },
    Ngoname: { type: String },
    CampaignName: { type: String },
    UserDetails: {
      Email: { type: String },
      Gender: { type: String },
      Phone: { type: String },
    },
    ProductDetails: [
      {
        category: {
          type: String,
        },
        image: {
          type: String,
        },
        price: {
          type: Number,
        },
        description: {
          type: String,
        },
        title:{
          type:String,
        }
      },
    ],
  },
  { timestamps: true }
);

const CartDetails = mongoose.model("CartDetails", productlisting);
module.exports = CartDetails;
