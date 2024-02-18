const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require('body-parser');
const User = require("../mongoSchema/userdetails");
const UserAuthLogin= require("../mongoSchema/userModel")
const middleware = require("../middleware/middleware");
const multer = require("multer");
const path =require("path");
const { log } = require('util');


app.use(express.static("profile_pic"));
app.use(bodyparser.json())

app.set("view engine", "ejs");
app.set("views", "./views");
///user folder


 



app.use(bodyparser, urlencoded({ extended: false }));
router.get("/",middleware.requireLogin, (req, res, next) => {
    return res.status(200).render("edituser");
})

router.post("/", async (req, res, next) => {
    const payload= req.body;

    console.log(payload);

    const UserAuthEmail= payload.UserloginEmail;
    const userExists = await UserAuthLogin.findOne({ email: UserAuthEmail });
    if (!userExists) {
        res.status(400);
        throw new Error("User not found, please signup");
      }

    // console.log(payload.file);

    // const user = await User.findOne({
    //   $or:   [{username : payload.username},
    //         {email: payload.email}]
    // })
    // .catch((error)=>{
    //     console.log(error);
    //     console.log("error in userinfo js");
    // })
    // console.log(user);
    if(0)
    {
        console.log("user exist");
        res.send("username or email already in use");
    }
    else{

//update
        // newvalues = {name : payload.name ,
        //      email: payload.email ,
        //      phone:payload.phone ,
        //      dob:payload.dob,
        //      gender:payload.gender,
        //      details:payload.details,
        //     //  profilePic: req.file.filename
        //     };
        console.log(userExists);
      console.log("i am working");
      let newvalues= new User();
      newvalues.Id= userExists._id;
      newvalues.name = payload.name ,
      newvalues.email = payload.email ,
      newvalues.phone=payload.phone ,
      newvalues.dob=payload.dob,
      newvalues.gender=payload.gender,
      newvalues.details=payload.details,
      newvalues.profilePic=payload.image
            //  profilePic: req.file.filename

     
        // let filter = {username : req.session.user.username};
        // console.log(filter);
        // const result = await User.updateOne({},newvalues);
        newvalues.save()
        .then(() => {
                  console.log("saved successfully");
                //   res.redirect("/users");
                })

        // if(result)
        // {
        //     console.log(result);
        //     console.log("successfully updated");
        //     // req.session.user = payload;
        //     res.redirect('/user');
        // }
        // else {
        //     console.log("error in updation");
        // }

    }
});



module.exports = router;



