const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const ejs = require('ejs');
const User = require("../mongoSchema/userdetails");
const forgot = require("./forgot_password_route");
const bcrypt=require("bcrypt");
const router = express.Router();
// import { username } from './forgot_password_route'

router.get("/:custom", (req, res)=>{
    const custom=forgot.username;
    console.log(forgot.username);
    console.log(forgot.token);
    res.render("reset-password");
})

router.post("/:custom",async (req, res) => {
    const custom=forgot.username;
    const val = req.body;
    var password=val.password;
    var confirmpassword=val.confirmpassword;
    console.log(val);
    if (password == confirmpassword) {
console.log(forgot.username);
console.log(forgot);

password = await bcrypt.hash(password, 10);

      let result =  await User.findOneAndUpdate({username:forgot.username},{password:password})
                .catch(()=>{
                    res.send("error in updation in resetpassword");
                })
                if(result)
                {
                    res.send("password updated successfully");
                }
            }
        else{
            res.send("password and confirm password are different");
        }
      

})

module.exports = router;
