const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    username:{type:String , required:true ,trim:true,unique:true },
    ngoname: [ {type: String, required: true, trim:true} ]
},{timestamps: true});

var reportmodel=mongoose.model('reportschema', reportSchema);
module.exports=reportmodel;