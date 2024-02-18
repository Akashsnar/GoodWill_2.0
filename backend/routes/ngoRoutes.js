const express = require("express");
const router = express.Router();
// const {
//   checkout_session,
//   loginUser,
//   logout,
//   loginStatus
// } = require("../controllers/userController");
// const protect = require("../middleware/authMiddleware");
// const {upload}= require("../utils/fileUpload");

// router.post("/register", upload.single("registrationProof"),registerUser);
router.post("/checkout_session",checkout_session);
router.post("/ngodetailsdelete", ngoDetailsDelete);

module.exports = router;
