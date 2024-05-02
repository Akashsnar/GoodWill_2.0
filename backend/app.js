const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const ngoschema = require("./mongoSchema/mongoschemango");
const reviewschema = require("./mongoSchema/reviewschema");
const Events = require("./mongoSchema/EventSchema");
const UserNgo = require("./mongoSchema/userModel");
const cookieParser = require("cookie-parser");
const http = require('http');
const { Server } = require('socket.io');
const db = require("./mongoSchema/database");
const multer = require("multer");
const morgan = require("morgan");
const cors = require("cors");
const { config } = require("dotenv");

const fs = require('fs');

const indexData = require('./Solr/SyncData.js');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const UserModel = require("./mongoSchema/userModel.js")
config();
// app.use(express.static("uploads"));
// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "Documentation for your API",
    },
    servers: [
      {
        url: "http://localhost:4000", // Update this with your server URL
      },
    ],
  },
  apis: [
    "./app.js",
    "./mongoSchema/*.js", // Update this path to include all your schema files
    "./routes/*.js", // Update this path to include all your route files
  ],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Your existing middleware and routes
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
const csrf = require("csurf");
const csrfprotection = csrf({ cookie: true });

const logStream = fs.createWriteStream(`28_log.txt`, { flags: "a" });
app.use(morgan("combined", { stream: logStream }));

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

//redis
const redis = require("redis");
const redisUrl = "redis://localhost:6379";
// const redisClient = redis.createClient({ url: redisUrl });


//redisthings


// redisClient.on("error", (err) => {
//   console.error("Redis connection error:", err);
// });
// redisClient.on("connect", () => {
//   console.log("Connected to Redis server");
// });

function cache(req, res, next) {
  // const key = req.originalUrl;
  // redisClient.get(key, (err, data) => {
  //   if (err) {
  //     console.error("Redis error:", err);
  //     next(); // Proceed without caching if there's an error
  //   }

  //   if (data !== null) {
  //     res.send(JSON.parse(data));
  //   } else {
  //     next();
  //   }
  // });
}

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


const CartPostRoutes = require('./routes/CartPostRoutes.js');
app.use("/api/users/cart", CartPostRoutes);


const UserRoute = require("./routes/UserRoute.js");
app.use("/api/users", UserRoute);
const Group_no = "Group_28";

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

const userdataRouter = require("./routes/sitedata");
app.use("/sitedata", userdataRouter);


const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/**
 * @swagger
 * /deleteNgo:
 *   post:
 *     summary: Delete NGO by ID
 *     description: Delete an NGO from the database by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the NGO to delete.
 *     responses:
 *       '200':
 *         description: NGO deletion successful
 *       '500':
 *         description: Internal server error
 */

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

const server = http.createServer(app);

const onlineUsers = new Set();
const userSocketId = new Map();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

const getId = async ({ email }) => {
    console.log(email)
    const user = await UserModel.findOne({ email: email });
    console.log(user)
    return user._id.toString();
}

function formatTimestamp(timestamp) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const date = new Date(timestamp);

  // Check if the timestamp is yesterday or earlier
  if (date.getFullYear() < currentYear || date.getMonth() < currentMonth || date.getDate() < currentDay) {
    // If it's yesterday or earlier, format as dd/mm/yyyy
    return date.toLocaleDateString('en-GB'); // Change the locale as needed
  } else {
    // If it's today, format as hh:mm A.M or P.M
    const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return formattedTime;
  }
}

const getAdminId = async () => {
  const admin = await UserModel.findOne({ mode: "Admin" });
  return admin._id.toString();
}

io.on("connection", async (socket) => {
    console.log(`emailId is ${socket.handshake.query.email}`);
    const userId = await getId({ email: socket.handshake.query.email });
    console.log("User Id is ", userId);
    const admin__id = await getAdminId();
    console.log("equal ", userId, admin__id)
    if(userId !== admin__id) {
      if(onlineUsers.has(admin__id)) {
        socket.to(userSocketId.get(admin__id)).emit("online-user", userId);
        socket.emit("online-admin");
        console.log("admin online")
      }
    } else {
      for (let [key, value] of userSocketId ) {
        if(key !== admin__id) {
          socket.to(value).emit("online-admin");
          socket.emit("online-user", key);
        }
      }
    }
    onlineUsers.add(userId);
    userSocketId.set(userId, socket.id);
    console.log(onlineUsers);
    console.log(userSocketId);
    socket.on("send-message", async (data) => {
        try {
            console.log("send_message")
            const {
              content,
              senderId,
              receiverId,
              roomId
            } = data;
            console.log(data)
            const newMessage = new Message({
                content,
                roomId,
                senderId
            });

            await newMessage.save();
            const formattedTime = formatTimestamp(newMessage.createdAt);
            const dataToSend = {
              senderId,
              content,
              time: formattedTime,
            };
            console.log(userSocketId.get(receiverId));
            if(onlineUsers.has(receiverId)) {
              socket.to(userSocketId.get(receiverId)).emit("recieve-message", dataToSend);
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        if(userId !== admin__id) {
          if(onlineUsers.has(admin__id)) {
            socket.to(userSocketId.get(admin__id)).emit("offline-user", userId);
          }
        } else {
          for (let [key, value] of userSocketId ) {
            if(key !== admin__id) {
              socket.to(value).emit("offline-admin");
            }
          }
        }
        onlineUsers.delete(userId);
        userSocketId.delete(userId);
    });
});

const Message = require("./mongoSchema/message");

app.get("/helpline/user-details/:emailId", async(req, res) => {
  try {
    const data = await UserModel.findOne({name :req.params.emailId});
    console.log("data" , data);
    const user = await UserModel.findOne({ email: req.params.emailId });
    if(!user) return res.status(400).json({ message: "User not found" });
    const admin = await UserModel.findOne({ mode: "Admin" });
    if(!admin) return res.status(400).json({ message: "Admin not found!" });
    const messages = await Message.find({ roomId: user._id });
    const formattedMessages = [];
    messages.forEach((message) => {
      const newMessage =  {
        content: message.content,
        senderId: message.senderId,
        time: formatTimestamp(message.createdAt)
      };
      formattedMessages.push(newMessage);
    })
    return res.status(200).json({ user_id: user._id, admin_id: admin._id, messages: formattedMessages });
  } catch(err) {
    console.log(err);
  }
})

app.get("/helpline/admin", async(req, res) => {
  try {
    const admin = await UserModel.findOne({ mode: "Admin" });
    if(!admin) return res.status(400).json({ message: "Admin not found!" });
    return res.status(200).json({ admin_id: admin._id })
  } catch(err) {
    return res.status(500);
  }
})
app.get("/helpline/admin/:userId", async(req, res) => {
  try {
    const admin = await UserModel.findOne({ mode: "Admin" });
    if(!admin) return res.status(400).json({ message: "Admin not found!" });
    const messages = await Message.find({ roomId: req.params.userId });
    const formattedMessages = [];
    messages.forEach((message) => {
      const newMessage =  {
        content: message.content,
        senderId: message.senderId,
        time: formatTimestamp(message.createdAt)
      };
      formattedMessages.push(newMessage);
    })
    return res.status(200).json({ messages: formattedMessages, admin_id: admin._id })
  } catch(err) {
    console.log(err);
  }
})

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
const { send } = require("process");

/**
 * @swagger
 * /deleteMessage:
 *   post:
 *     summary: Delete message by ID
 *     description: Delete a message from the database by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the message to delete.
 *     responses:
 *       '200':
 *         description: Message deletion successful
 *       '500':
 *         description: Internal server error
 */

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


app.get("/sitedata/chatlists", async(req, res) => {
  const users = await UserModel.find({ mode: "User" });
  return res.status(200).json(users);
})
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

/**
 * @swagger
 * /deleteEvent:
 *   post:
 *     summary: Delete event by ID
 *     description: Delete an event from the database by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the event to delete.
 *     responses:
 *       '200':
 *         description: Event deletion successful
 *       '500':
 *         description: Internal server error
 */

app.post("/deleteEvent", async (req, res) => {
  const id = req.body.id;
  console.log("confirmDeleteIndex:", id);

  try {
    await Events.findByIdAndDelete(id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * @swagger
 * /deleteNGOData:
 *   post:
 *     summary: Delete NGO data by ID
 *     description: Delete NGO data from the database by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the NGO data to delete.
 *     responses:
 *       '200':
 *         description: Deletion successful
 *       '500':
 *         description: Internal server error
 */

app.post("/deleteNGOData", async (req, res) => {
  const id = req.body.id;
  console.log("confirmDeleteIndex:", id);

  try {
    await UserNgo.findByIdAndDelete(id);
    res.status(200).json({ message: "Deletion successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(function (err, req, res, next) {
  console.error(err.stack, err);
  res.status(500).send("Something broke!");
});


app.get("/eventsData", cache, async (req, res) => {

/**
 * @swagger
 * /eventsData:
 *   get:
 *     summary: Get all events data
 *     description: Retrieve all events data from the database.
 *     responses:
 *       '200':
 *         description: Returns all events data.
 *       '500':
 *         description: Internal server error
 */

  try {
    const event = await Events.find().sort({ _id: -1 });
    // redisClient.setex(req.originalUrl, 3600, JSON.stringify(event));
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/eventsLength", cache, async (req, res) => {

/**
 * @swagger
 * /eventsLength:
 *   get:
 *     summary: Get the number of events
 *     description: Retrieve the count of events from the database.
 *     responses:
 *       '200':
 *         description: Returns the number of events.
 *       '500':
 *         description: Internal server error
 */


  try {
    const event = await Events.find();
    // redisClient.setex(req.originalUrl, 3600, JSON.stringify(event));
    res.json(event.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /ngosData:
 *   get:
 *     summary: Get NGO data
 *     description: Retrieve data of NGOs from the database.
 *     responses:
 *       '200':
 *         description: Returns data of NGOs.
 *       '500':
 *         description: Internal server error
 */

app.get("/ngosData", async (req, res) => {
  try {
    const ngo = await UserNgo.find({ mode: "Ngo" }).sort({ _id: -1 });
    // redisClient.setex(req.originalUrl, 3600, JSON.stringify(ngo));
    res.json(ngo);
  } catch (err) { 
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /NGOsLength:
 *   get:
 *     summary: Get the number of NGOs
 *     description: Retrieve the count of NGOs from the database where the mode is set to "Ngo".
 *     responses:
 *       '200':
 *         description: Returns the number of NGOs.
 *       '500':
 *         description: Internal server error
 */

app.get("/NGOsLength", async (req, res) => {
  try {
    const ngo = await UserNgo.find({ mode: "Ngo" });
    res.json(ngo.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// indexData();


app.get('/users', (req, res) => {
  const users = [    { id: 1, name: 'Alice' },    { id: 2, name: 'Bob' },    { id: 3, name: 'Charlie' },  ];
  res.json(users);
});

const url = "mongodb+srv://aksn0204:aAKgkxCEiyXB5O59@cluster0.dpmnhfa.mongodb.net/GoodWill";

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
// module.exports = app;

