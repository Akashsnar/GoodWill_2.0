const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productpurchaseschema =new Schema({
            productId: {
            type: mongoose.Schema.Types.ObjectId
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId
                },           
                quantity:{
                    type: Number
                }           
}, {timestamps: true})

const productpurchase = mongoose.model('productpurchase', productpurchaseschema)
module.exports= productpurchase;