const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  loginStatus
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
// const {upload}= require("../utils/fileUpload");

// router.post("/register", upload.single("registrationProof"),registerUser);
router.post("/register",registerUser);
router.post("/login", loginUser);

router.get("/logout", logout);
router.get("/loggedin",loginStatus);
module.exports = router;
