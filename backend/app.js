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

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cors = require("cors");
const { config } = require("dotenv");
config();
app.use(express.static("uploads"));
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
const port = 4000;

// app.post('/contact', async (req, res) => in services
// app.post('/deleteContact', async (req, res) => in services
////searching

app.post("/user", async (req, res) => {
  console.log("/user running");
  try {
    let sear = req.body.payload;
    const rating = req.body.payloadr;
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

// dcheckout -> ngo_route

// app.post('/getreviews', async (req, res) =>   AdminRoute

//ngdetails-> adminRoute
//userdetail -> adminRoute
//reviewdetails-> adminRoute
//reportdetails-> adminRoute
//ngos
// app.post("/reportdata", async (req, res) =>  Services

//ngos
// app.post('/getrating', async (req, res) => Services

// app.post("/feedback", async (req, res) => {
//   res.redirect("feedback");
// });

// post
// app.post('/post', upload.single('image'), async (req, res) => {
//   var x = new ngoschema();
//   x.username = req.session.ngo;
//   x.name = req.body.name;
//   x.image = req.file.filename;
//   x.desc = req.body.desc;
//   console.log(x.name);
//   console.log(x.username);
//   console.log(x.desc);
//   console.log(req.body.desc);
//   x.save()
//     .then((doc) => {
//       console.log("bloody pass");
//       res.redirect("/users");
//     })
//     .catch(function (err) {
//       console.log(err);

//     })
// });

// app.post("/delete", function (req, res) {
//   const it = req.body.checkbox;
//   ngoschema.findByIdAndDelete(it)
//     .then(function (it) {
//       console.log("bloody pass");
//       res.redirect("/users");
//     })
//     .catch(function (err) {
//       console.log(err);

//     })

// });

// app.post("/images", function (req, res) {
//   res.redirect("/users");
// });

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
