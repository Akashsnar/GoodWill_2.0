const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const ngoschema = require("./mongoSchema/mongoschemango");
const reviewschema = require("./mongoSchema/reviewschema");
const reportschema = require("./mongoSchema/reportschema");
const cookieParser = require("cookie-parser");
const db = require("./mongoSchema/database");
const multer = require("multer");
const morgan = require("morgan");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cors = require("cors");
const { config } = require("dotenv");
const fs = require('fs');
config();
// app.use(express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static("registrationproof"));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(express.static("profile_pic"));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
const csrf = require('csurf');
const csrfprotection=csrf({ cookie: true });

const logStream = fs.createWriteStream(`28_log.txt`, { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});


const UserRoute = require("./routes/UserRoute.js");
app.use("/api/users", UserRoute);
const Group_no = 'Group_28'; 

const port = 4000;

app.post("/user", csrfprotection, async (req, res) => {
  console.log("/user running");
  try {
    let sear = req.body.payload;
    const rating = req.body.payload;
    console.log(rating);
    if (sear == undefined) {
      sear = "";
    }
    console.log(sear);
    const pipeline = [
      { $match: { username: new RegExp(`^${sear}`, "i") } },
      { $group: { _id: "$username", doc: { $first: "$$ROOT" } } },
    ];
    let obj = await ngoschema.aggregate(pipeline);
    if (rating == undefined) {
      console.log(obj);
      res.status(200).send({ payload: obj });
    } else {
      await reviewschema
        .find({ rating: rating })
        .then((reviews) => {
          console.log(reviews);
          const reviewslist = [];
          reviews.forEach((Element) => {
            reviewslist.push(Element.ngoname);
          });
          console.log(reviewslist);
          const result = [];
          const distinctArr = reviewslist.filter(
            (ob, index, self) => index === self.findIndex((t) => t === ob)
          );

          console.log(distinctArr);

          // const result = obj.filter(p => reviewslist.includes(p.username));
          obj.forEach((Element) => {
            for (i = 0; i < distinctArr.length; i++) {
              if (Element.doc.username == distinctArr[i]) {
                result.push(Element);
              }
            }
          });
          // console.log(obj);
          res.status(200).send({ payloadr: result });
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (err) {
    console.log(err);
    res.send("Error Searching");
  }
});

// reviews->services
const forgetp = require("./routes/forgot_password_route");
app.use("/forgetpassword", forgetp);

const resetpasswordroute = require("./routes/resetpasswordroute");
const { error } = require("console");
app.use("/reset-password", resetpasswordroute);

const userinfo = require("./routes/userinfo");
app.use("/userinfo", userinfo);

const AdminRoute = require("./routes/adminRoutes");
app.use("/admin", AdminRoute);

app.use("/bloguser", userRoute);
app.use("/blog", blogRoute);
const userdataRouter = require("./routes/sitedata");
app.use("/sitedata", userdataRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

app.post("/deleteNgo", async (req, res) => {
  const id = req.body.id;
  console.log("confirmDeleteIndex:", id);

  try {
    await ngoschema.findByIdAndDelete(id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
const User = require("./mongoSchema/userdetails");
app.post("/deleteUser", async (req, res) => {
  const id = req.body.id;
  console.log("confirmDeleteIndex:", id);

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});



const Feedback = require("./mongoSchema/feedbackSchema");
app.post("/deleteFeedback", async (req, res) => {
  const id = req.body.id;
  console.log("confirmDeleteIndex:", id);

  try {
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const Contact = require("./mongoSchema/contactSchema");
const Donation = require("./mongoSchema/donationschema.js");
app.post("/deleteMessage", async (req, res) => {
  const id = req.body.id;
  console.log("confirmDeleteIndex:", id);

  try {
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/deleteReview", async (req, res) => {
  const id = req.body.id;
  console.log("confirmDeleteIndex:", id);

  try {
    await reviewschema.findByIdAndDelete(id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/deleteDonation", async (req, res) => {
  const id = req.body.id;
  console.log("confirmDeleteIndex:", id);

  try {
    await Donation.findByIdAndDelete(id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

