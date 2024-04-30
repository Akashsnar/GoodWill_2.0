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

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new user account
 *     description: Create a new user account with the provided full name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mode:
 *                 type: string
 *                 example: "user"
 *               name:
 *                 type: string
 *                 example: "tapesh"
 *               email:
 *                 type: string
 *                 example: "rohan123@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       '302':
 *         description: User account created successfully, redirected to the bloghome page
 */
router.post("/register",registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user with the provided mode, email, and password, and generate a token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mode:
 *                 type: string
 *                 example: "user"
 *               email:
 *                 type: string
 *                 example: "roh12@gmail.com"
 *               password:
 *                 type: string
 *                 example: "1234Rtdd"
 *     responses:
 *       '200':
 *         description: User authenticated successfully, returns user information and token
 *       '400':
 *         description: Invalid request or user not found
 */

router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout a user
 *     description: Logout a user by clearing the authentication token stored in the cookie.
 *     responses:
 *       '200':
 *         description: User successfully logged out
 *       '401':
 *         description: Not authorized, please login
 */

router.get("/logout", logout);

/**
 * @swagger
 * /api/users/loginStatus:
 *   get:
 *     summary: Get login status
 *     description: Check the login status of a user based on the presence and validity of the authentication token.
 *     responses:
 *       '200':
 *         description: Returns true if the user is logged in, false otherwise
 */

router.get("/loggedin",loginStatus);
module.exports = router;
