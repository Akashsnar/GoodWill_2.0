const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require("body-parser");
const User = require("../mongoSchema/userdetails");
const Ngomodel = require("../mongoSchema/mongoschemango");
const UserAuthLogin = require("../mongoSchema/userModel");
const middleware = require("../middleware/middleware");
const multer = require("multer");
const path = require("path");
const { log } = require("util");

router.get("/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    //  console.log(name);
    const regex = new RegExp(name, "i");
    const User_details = await User.find({ name: regex });
    console.log(User_details[0]);
    res.json(User_details[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res, next) => {  
  try {
    const User_details = await User.find();
    res.json(User_details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




router.post("/", async (req, res, next) => {
  const payload = req.body;
  console.log(payload);
  const UserAuthEmail = payload.UserloginEmail;

  try {
     const name=req.params.name;
    //  console.log(name);
     const regex = new RegExp(name, 'i');
     const User_details = await User.find({ name : regex});
     console.log(User_details[0]);
     res.json(User_details[0])
   } catch (err) {
     res.status(500).json({ message: err.message })
   }
 })

router.get("/", async(req, res, next) => {
 try {
    const User_details = await User.find().sort({ _id: -1 });
    res.json(User_details)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  
    const userExists = await UserAuthLogin.findOne({ email: UserAuthEmail });
    const userid=userExists._id;
    let user = await User.findOne({ Id: userid  });

    if (!user) {
        user = new User({
            Id:userExists._id,
            name:payload.name,
            Email:payload.email,
            profilePic:payload.image,
            phone:payload.phone,
            dob:payload.dob,
            gender:payload.gender,
            details:payload.details
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } else {
      
      user.name=payload.name,
      user.profilePic=payload.image,
      user.Email=payload.email,
      user.phone=payload.phone,
      user.dob=payload.dob,
      user.gender=payload.gender,
      user.details=payload.details

        await user.save();
        res.json({ message: 'User details updated successfully', user });
    }
} catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
}












 

  // const userExists = await UserAuthLogin.findOne({ email: UserAuthEmail });
  // if (!userExists) {
  //   res.status(400);
  //   throw new Error("User not found, please signup");
  // }

  // // console.log(payload.file);

  // // const user = await User.findOne({
  // //   $or:   [{username : payload.username},
  // //         {email: payload.email}]
  // // })
  // // .catch((error)=>{
  // //     console.log(error);
  // //     console.log("error in userinfo js");
  // // })
  // // console.log(user);
  // if (0) {
  //   console.log("user exist");
  //   res.send("username or email already in use");
  // } else {
  //   //update
  //   // newvalues = {name : payload.name ,
  //   //      email: payload.email ,
  //   //      phone:payload.phone ,
  //   //      dob:payload.dob,
  //   //      gender:payload.gender,
  //   //      details:payload.details,
  //   //     //  profilePic: req.file.filename
  //   //     };
  //   console.log(userExists);
  //   console.log("i am working");
  //   let newvalues = new User();
  //   newvalues.Id = userExists._id;
  //   (newvalues.name = payload.name),
  //     (newvalues.email = payload.email),
  //     (newvalues.phone = payload.phone),
  //     (newvalues.dob = payload.dob),
  //     (newvalues.gender = payload.gender),
  //     (newvalues.details = payload.details),
  //     (newvalues.profilePic = payload.image);
  //   //  profilePic: req.file.filename

  //   // let filter = {username : req.session.user.username};
  //   // console.log(filter);
  //   // const result = await User.updateOne({},newvalues);
  //   newvalues.save().then(() => {
  //     console.log("saved successfully");
  //     //   res.redirect("/users");
  //   });

  //   // if(result)
  //   // {
  //   //     console.log(result);
  //   //     console.log("successfully updated");
  //   //     // req.session.user = payload;
  //   //     res.redirect('/user');
  //   // }
  //   // else {
  //   //     console.log("error in updation");
  //   // }
  // }
});

router.post("/", async (req, res, next) => {
  const payload = req.body;

  console.log(payload);

  const UserAuthEmail = payload.UserloginEmail;
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
  if (0) {
    console.log("user exist");
    res.send("username or email already in use");
  } else {
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
    let newvalues = new User();
    newvalues.Id = userExists._id;
    (newvalues.name = payload.name),
      (newvalues.email = payload.email),
      (newvalues.phone = payload.phone),
      (newvalues.dob = payload.dob),
      (newvalues.gender = payload.gender),
      (newvalues.details = payload.details),
      (newvalues.profilePic = payload.image);
    //  profilePic: req.file.filename

    // let filter = {username : req.session.user.username};
    // console.log(filter);
    // const result = await User.updateOne({},newvalues);
    newvalues.save().then(() => {
      console.log("saved successfully");
      //   res.redirect("/users");
    });

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

router.post("/donation", async (req, res) => {
  console.log(req.body);
  const { username, NgoName, campaignName, donationAmount, email, phone } =
    req.body;

  const ngos = await Ngomodel.findOne({
    ngoname: NgoName,
    campagainname: campaignName,
  });

  if (ngos) {
    // Document exists, update the goal field
    await Ngomodel.updateOne(
      {
        ngoname: NgoName,
        campagainname: campaignName,
      },
      {
        $set: {
          raised: ngos.raised + parseInt(donationAmount),
        },
      }
    );
  } else console.log("NO such ngo is present");

  const getngo = await Ngomodel.findOne({
    ngoname: NgoName,
    campagainname: campaignName,
  });
  console.log(getngo);
});

module.exports = router;
