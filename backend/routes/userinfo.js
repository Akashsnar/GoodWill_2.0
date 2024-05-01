const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require("body-parser");
const User = require("../mongoSchema/userdetails");
const Ngomodel = require("../mongoSchema/mongoschemango");
const cartDetails= require("../mongoSchema/productlisting")
const UserAuthLogin = require("../mongoSchema/userModel");
const middleware = require("../middleware/middleware");
const multer = require("multer");
const path = require("path");
const { log } = require("util");
const Donation = require("../mongoSchema/donationschema");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /userinfo/{name}:
 *   get:
 *     summary: Get user by name
 *     description: Retrieve a user by their name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         type: string
 *         description: The name of the user to retrieve.
 *     responses:
 *       '200':
 *         description: The user with the specified name.
 *       '404':
 *         description: User not found.
 */

router.get("/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    //  console.log(name);
    // const regex = new RegExp(name, "i");
    const User_details = await User.find({ name: name });
    console.log(User_details[0]);
    res.json(User_details[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /userinfo/donationsUsername:
 *   post:
 *     summary: Get donations by username
 *     description: Retrieve donations made by a specific user based on their username.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user to retrieve donations for.
 *     responses:
 *       '200':
 *         description: Returns the donations made by the user and the total donation amount.
 *       '500':
 *         description: Internal server error.
 */

router.post("/donationsUsername", async (req, res) => {
  try {
    console.log("Hello Donation User")
    const username = req.body.username;
    // const username = "Swastik";
    console.log(username)
    const donations = await Donation.find({ username: username }).sort({ _id: -1 });
    console.log("donation data->", donations);
    let totaldonation = 0;

    for (const donation of donations) {
      totaldonation += parseInt(donation.donationAmount);
    }
    console.log("Total Donation:", totaldonation);
    res.json({ donations, totaldonation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/donationneeds/:username", async (req, res) => {
  try {
    console.log("Hello Donation User Needs")
    const username = req.params.username;
    // const username = "Swastik";
    console.log(username)
    const donationsneeds = await cartDetails.find({ Username: username }).sort({ _id: -1 });
    console.log("donation needs data-> ", donationsneeds);
    let totaldonation = 0;

    // for (const donation of donationsneeds) {
    //   totaldonation += parseInt(donation.ProductDetails.price);
    // }
    for (const donation of donationsneeds) {
      for (const pd of donation.ProductDetails){
        totaldonation += parseInt(pd.price);
      }
   }

    console.log("Total Donation:", totaldonation);
    res.json({ donationsneeds, totaldonation });
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

router.post("/", upload.single('image'), async (req, res, next) => {
  const payload = req.body;
  console.log(payload);
  console.log(req.file);
  const userExists = await UserAuthLogin.findOne({ email: payload.UserloginEmail });
  const userid = userExists._id;
  let user = await User.findOne({ Id: userid });
  try {
    if (!user) {
      user = new User({
        Id: userExists._id,
        name: payload.name,
        Email: payload.email,
        profilePic: req.file.filename,
        phone: payload.phone,
        dob: payload.dob,
        gender: payload.gender,
        details: payload.details
      });

      await user.save();
      res.status(201).json({ message: 'User created successfully', user });
    } else {

      user.name = payload.name,
        user.profilePic = req.file.filename,
        user.Email = payload.Email,
        user.phone = payload.phone,
        user.dob = payload.dob,
        user.gender = payload.gender,
        user.details = payload.details

      await user.save();
      res.json({ message: 'User details updated successfully', user });
    }
  }
  catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
  if (0) {
    console.log("user exist");
    res.send("username or email already in use");
  } else {
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
    newvalues.save().then(() => {
      console.log("saved successfully");
    });
  }
});

/**
 * @swagger
 * /userinfo/donation:
 *   post:
 *     summary: Submit donation form data
 *     description: Submit donation form data and update the donation amount for a specific NGO campaign.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               userid:
 *                 type: string
 *               NgoName:
 *                 type: string
 *               campaignName:
 *                 type: string
 *               donationAmount:
 *                 type: number
 *               campaignid:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Form data submitted successfully
 *       '500':
 *         description: Internal server error
 */

router.post("/donation", async (req, res) => {
  console.log(req.body);
  const { username, userid, NgoName, campaignName, donationAmount, campaignid, email, phone } =
    req.body;
  try {
    const DonationData = new Donation(req.body);
    console.log(DonationData);
    await DonationData.save();
    res.status(200).json({ message: "Form data submitted successfully" });
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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