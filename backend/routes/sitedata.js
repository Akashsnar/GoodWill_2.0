const express = require("express");
const router = express.Router();
const User = require("../mongoSchema/userdetails");
const Ngos = require("../mongoSchema/ngoschema");
const Review = require("../mongoSchema/reviewschema");
const Contact = require("../mongoSchema/contactSchema");
const Feedback = require("../mongoSchema/feedbackSchema");
const Ngomodel = require("../mongoSchema/mongoschemango");
const Donation = require("../mongoSchema/donationschema");
const Events = require("../mongoSchema/EventSchema");
const expressAsyncHandler = require("express-async-handler");

// Getting all
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/ngodetails", async (req, res) => {
  try {
    const ngomodel = await Ngomodel.find().sort({ _id: -1 });
    res.json(ngomodel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/ngodetail/:ngoid", async (req, res) => {
  const campagainid = req.params.ngoid;
  console.log(campagainid);
  try {
    let query = { _id: campagainid };
    const ngomodel = await Ngomodel.findOne(query);
    console.log(ngomodel);
    res.json(ngomodel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/allUsers", async (req, res) => {
  try {
    const User = await User.find();
    res.json(User);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/userlength", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/ngolength", async (req, res) => {
  try {
    const ngos = await Ngomodel.find();
    res.json(ngos.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/reviewlength", async (req, res) => {
  try {
    const review = await Review.find();
    res.json(review.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/messageslength", async (req, res) => {
  try {
    const contact = await Contact.find();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/ngodetail", async (req, res) => {
  try {
    const ngo = await Ngos.find().sort({ _id: -1 });
    res.json(ngo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/feedbacks", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ _id: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/reviews", async (req, res) => {
  try {
    const review = await Review.find().sort({ _id: -1 });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/addComment", async (req, res) => {
  try {
    const { author, ngoname, campagainname, rating, text } = req.body;
    console.log("comment", req.body);
    const newComment = new Review({
      author,
      ngoname,
      campagainname,
      rating,
      text,
    });

    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/contact", async (req, res) => {
  try {
    const contact = await Contact.find().sort({ _id: -1 });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/donations", async (req, res) => {
  try {
    const donation = await Donation.find().sort({ _id: -1 });
    console.log("donation data->", donation);
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/donationsCampaign", async (req, res) => {
  try {
    // console.log("Hello")
    const campaignname = req.body.campaignname;
    console.log(campaignname)
    const donation = await Donation.find({ campaignName: campaignname }).sort({ _id: -1 });
    console.log("donation data->", donation);
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/donationsNGO", async (req, res) => {
  try {
    // console.log("Hello")
    const NgoName = req.body.Ngoname;
    console.log(NgoName);
    // console.log(campaignname)
    const donation = await Donation.find({ NgoName: NgoName }).sort({ _id: -1 });
    console.log("donation data->", donation);
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




router.get("/campaign/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    console.log(name);
    const regex = new RegExp(name, "i");
    const Campaign_details = await Ngomodel.find({ campagainname: regex });
    console.log(Campaign_details[0]);
    res.json(Campaign_details[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One use detail
router.get("/userdetail/:userid", async (req, res) => {
  console.log("i am triggered");
  const User_Id = req.params.userid;
  console.log(User_Id);
  try {
    let query = { Id: User_Id };
    const Result = await User.findOne(query);
    console.log(Result);
    res.json(Result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one
router.post("/", async (req, res) => {
  const User = new User({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });
  try {
    const newUser = await User.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// router.get('/userdetail/:id', getUser, (req, res) => {

router.post("/submitmessage", async (req, res) => {
  try {
    // console.log(req.body)
    // Create a new document using the FormData model
    const newContact = new Contact(req.body);
    console.log(newContact);
    // Save the document to the database
    await newContact.save();

    // Send a response back to the client
    res.status(200).json({ message: "Form data submitted successfully" });
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/feedback", async (req, res) => {
  try {
    const feedbackData = new Feedback(req.body);
    console.log(feedbackData);
    await feedbackData.save();
    res.status(200).json({ message: "Form data submitted successfully" });
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/ngo_details", async (req, res) => {
  try {
    console.log(req.body);
    const payload = req.body;
    const newngomodel = new Ngomodel();
    console.log("i am working");
    // newngomodel.Id= userExists._id;
    (newngomodel.ngoname = payload.ngoname),
      (newngomodel.campagainname = payload.campagainname),
      (newngomodel.category = payload.category),
      (newngomodel.goal = payload.goal),
      (newngomodel.desc = payload.desc),
      (newngomodel.image = payload.image);
    newngomodel.raised = payload.raised;
    newngomodel.status = "ongoing";
    //  profilePic: req.file.filename

    // let filter = {username : req.session.user.username};
    // console.log(filter);
    // const result = await User.updateOne({},newngomodel);
    await newngomodel.save().then(() => {
      console.log("saved successfully");
      //   res.redirect("/users");
    });

    res.status(201).json({ message: "Uploaded Successfully" });
  } catch (err) {
    console.error(err); // Log the error to the console for debugging
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// Updating One
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.name != null) {
    res.User.name = req.body.name;
  }
  if (req.body.subscribedToChannel != null) {
    res.User.subscribedToChannel = req.body.subscribedToChannel;
  }
  try {
    const updatedUser = await res.User.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.User.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    // User = "Hi i am"

    if (user == null) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.User = user;
  next();
}

router.get("/reviews/:campaignname", async (req, res) => {
  try {
    const review = await Review.find({
      campagainname: req.params.campaignname,
    }).sort({ _id: -1 });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/getevents",
  expressAsyncHandler(async (req, res) => {
    console.log("hello");
    const { NgoName } = req.body;
    console.log(NgoName);
    const eventdetails = await Events.find({
      NgoName,
    });

    if (eventdetails) {
      res.status(200).send(eventdetails);
    } else {
      res.status(400);
      throw new Error("No events are registered");
    }
  })
);
router.post(
  "/events",
  expressAsyncHandler(async (req, res) => {

    const { NgoName, campaignName, EventPic, EventName, Location, Duration, Details, DateRange } = req.body;
    console.log("image", campaignName, EventPic);

    const { startDate, endDate } = DateRange;
    if (!NgoName || !EventName || !Location || !Duration || !DateRange) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    const newevent = await Events.create({
      NgoName,
      campaignName,
      EventPic,
      EventName,
      Location,
      Duration,
      Details,
      DateRange: {
        startDate: startDate,
        endDate: endDate,
      },
    });
    newevent.save();
    if (newevent) {
      const { _id, NgoName, Location, Duration, DateRange } = newevent;
      console.log(newevent);
      res.status(201).json({
        _id,
        NgoName,
        Location,
        Duration,
        DateRange,
      });
    } else {
      res.status(500);
      throw new Error("Invalid data");
    }
  })
);



router.post("/ngodetails/campns", async (req, res) => {
  const ngoname = req.body.ngoname;
  const status = req.body.status;

  console.log(ngoname);
  console.log(status)
  try {
    let query = { ngoname: ngoname, status: status };
    const ngomodel = await Ngomodel.find(query).sort({ _id: -1 });
    console.log(ngomodel);
    res.json(ngomodel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

  router.post("/user/volunteer", async (req, res) => {
    try {
      console.log("this is volunteer");
      const { campaignid, userid } = req.body;
      console.log(req.body);
      const users = await User.updateOne(
        { _id: userid },
        { $push: { volunteerNgosCampaign: campaignid } }
      );

      if (users.matchedCount === 0) {
        console.log('User not found');
      } else {
        console.log('NGO added for user successfully');
      }

      //campagians

      const ngos = await Ngomodel.updateOne(
        { _id: campaignid },
        { $push: { volunteers: userid } }
      );

      if (ngos.matchedCount === 0) {
        console.log('User not found');
      } else {
        console.log('NGO added for user successfully');
      }

      res.status(200).send({ users, ngos });
    } catch (error) {
      res.status(500).json({ message: err.message });
    }

  })

  router.post("/event/addusers", async (req, res) => {
    try {
      const { eventid, userid } = req.body;
      console.log(req.body);
      const Eventsupdate = await Events.updateOne(
        { _id: eventid },
        { $push: { ParticipatedUser: userid } }
      );

      if (Eventsupdate.matchedCount === 0) {
        console.log('Events not found');
      } else {
        console.log('User participated successfully');

      }
      res.status(200).send(Eventsupdate);

    } catch (error) {
      res.status(500).json({ message: err.message });
    }


  })

  // router.get("/ngodetails/campns", async (req, res) => {
  //   const ngoname = req.params.ngoname;
  router.post("/ngodetails/campns", async (req, res) => {
  const ngoname = req.body.ngoname;
  const status = req.body.status;

    console.log(ngoname);
    // console.log(status)
    try {
      let query = { ngoname: ngoname, status: status };
      const ngomodel = await Ngomodel.find(query).sort({ _id: -1 });
      console.log(ngomodel);
      res.json(ngomodel);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post("/closecamp", async (req, res) => {
    const CloseId = req.body.CloseId;
    console.log(CloseId);
    try {

      const result = await Ngomodel.findByIdAndUpdate(CloseId, { $set: { status: "closed" } });

      if (!result) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(result);
    } catch (err) {

      res.status(500).json({ message: err.message });
    }
  });

  router.post("/opencamp", async (req, res) => {
    const OpenId = req.body.OpenId;
    console.log(OpenId);
    try {

      const result = await Ngomodel.findByIdAndUpdate(OpenId, { $set: { status: "ongoing" } });


      if (!result) {
        return res.status(404).json({ message: "Document not found" });
      }


      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });




  module.exports = router;
