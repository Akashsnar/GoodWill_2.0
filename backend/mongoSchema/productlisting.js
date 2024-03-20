const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productlistingschema =new Schema({
        ngoId: {
            type: mongoose.Schema.Types.ObjectId
            },
            campaignId: {
                type: mongoose.Schema.Types.ObjectId
                },
            productname:{
             type: String
            },
            productimage:{
                type:string
            },
            amount:{
                type: Number
            },
            details:{
                type:String
            }
            
}, {timestamps: true})

const productlisting = mongoose.model('productlisting', productlistingschema)
module.exports= productlisting;