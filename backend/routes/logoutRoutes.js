const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require('body-parser');



app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyparser, urlencoded({ extended: false }));
router.get("/", (req, res, next) => {

    res.status(200).render("User");
})

// router.delete('')
// app.post("/", (req, res)=>{
//     res.render("/landingPageIndex");
// })
router.delete('user', (req, res)=>{
    if (req.session) {
        req.session.destroy(err=>{
            if (err) {
                res.status(400).send("unable to logout");
            }
            else{
                res.send("logout");
            }
        })
    } else{
        res.end();
    }
})