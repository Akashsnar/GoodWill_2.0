const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require('body-parser');
const ngoschema = require("../mongoSchema/ngoschema");
const mongoschema = require("../mongoSchema/userdetails");
const reviewschema = require("../mongoSchema/reviewschema");

app.set("view engine", "ejs");
app.set("views", "./views");
const {
    ngoDetailsDelete,
    userDetailsDelete,
    reviewdetailsDelete,
    reportdetailsDelete,
    ContactDelete,
    GetReviews
} = require("../controllers/adminController");
app.use(bodyparser, urlencoded({ extended: false }));



router.post("/userdetailsdelete",userDetailsDelete);
router.post("/ngodetailsdelete",ngoDetailsDelete);
router.post("/reviewdetailsdelete",reviewdetailsDelete);
router.post("/reportdetailsdelete",reportdetailsDelete);
router.post("/ngodetailsdelete",ngoDetailsDelete);
router.post("/contactdelete",ContactDelete);
router.post("/getreviews",GetReviews);

module.exports = router;