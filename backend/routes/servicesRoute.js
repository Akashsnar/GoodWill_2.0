const express = require("express");
const router = express.Router();
const {
  Contact_details,
  Review,
  ReportNgos
  , 
  GetRating

} = require("../controllers/servicesController");

router.post("/contact",Contact_details);
router.post("/reviews",Review);
router.post("/reportdata",ReportNgos);
router.post("/getrating",GetRating);



module.exports = router;
