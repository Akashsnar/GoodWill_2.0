const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productlistingschema = new Schema(
  {
    ngo_storeDetails: {
      type: Object,
      default: {}
    },
    user_storeDetails: {
      type: Object,
      default: {}
    },
    category: {
      type: String,
    },
    image: {
      type: string,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const productlisting = mongoose.model("productlisting", productlistingschema);
module.exports = productlisting;
