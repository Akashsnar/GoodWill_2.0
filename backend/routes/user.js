const { Router } = require("express");
const User = require('../mongoSchema/user');
const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin", {
        user: req.user
    });
});

router.get("/signup", (req, res) => {
    return res.render("signup", {
        user: req.user
    });
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).status(200).send();
    }
    catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
            user: req.user
        });
        return res.status(404).send();
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/bloghome");
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/bloghome");
});

module.exports = router;