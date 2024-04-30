const express = require('express');
const router = express.Router();
const {handleCart} = require('../controllers/cartController');

router.post('/cartdetails',handleCart);
// router.post('/cartdetails',(req,res)=>{
//     console.log('h')
// });

module.exports=router;