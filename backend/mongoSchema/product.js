const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productschema =new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        },
        ngoId: {
            type: mongoose.Schema.Types.ObjectId
            },
            campaignId: {
                type: mongoose.Schema.Types.ObjectId
                },
            productname:{
             type: String
            },
            amount:{
                type: Number
            },
            quantity:{
                type: Number
            }
            
}, {timestamps: true})

const product = mongoose.model('product', productschema)
module.exports= product;