const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require('body-parser');
const mongoose = require("mongoose");
const User = require("../mongoSchema/mongoschema");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyparser, urlencoded({ extended: false }));
router.get("/", (req, res, next) => {
console.log("i am in use");
    return res.status(200).render("edituser");
})


router.post("/", async (req, res, next) => {
    console.log("he he hi ho jai jo");
})
module.exports=router;