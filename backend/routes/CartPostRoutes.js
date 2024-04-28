const express = require('express');
const router = express.Router();
const expressAsyncHandler = require('express-async-handler');
const productlisting = require('../mongoSchema/Products');
router.post('/cartdetails',expressAsyncHandler(async(req,res)=>{

    const payload = req.body;
    console.log("je");
    console.log(req.body);
    res.status(200).send(req.body)

}));
module.exports=router;