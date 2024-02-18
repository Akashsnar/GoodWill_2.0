const asyncHandler = require("express-async-handler");
const Contact = require('./mongoSchema/contactSchema.js');


const Contact_details = asyncHandler(async (req, res) => {
    const contactobj = new Contact();
    contactobj.name = req.body.username;
    contactobj.email = req.body.email;
    contactobj.message = req.body.message;
    await contactobj.save();
    // res.redirect("/contact");
})

const Review = asyncHandler(async (req, res) => {
    const payload = req.body;
    console.log(payload);
    const reviewdata = new reviewschema();
    reviewdata.ngoname = payload.ngoname.trim();
    reviewdata.username = payload.username;
    reviewdata.rating = payload.rating;
    reviewdata.comment = payload.comment;
    console.log("didn work");
    await reviewdata.save();
    console.log("didn work");
    // return res.status(200).redirect('/');
})

const ReportNgos = asyncHandler(async (req, res) => {
    const username = req.session.user.username;
    console.log(username);
    const ngoname = req.body.htmlcontent;
    const color = req.body.color;
    const check_username_exists = await reportschema.findOne({ username: username });
    console.log("this " + check_username_exists);
    if (check_username_exists) {
        console.log(ngoname + " : color : " + color);
        //if black
        if (color === 'black') {
            await reportschema.findOne({ username: username }).updateOne(
                { $pull: { ngoname: ngoname } }
                // { new: true }
            )
        }
        else {
            //if red
            await reportschema.findOne({ username: username }).updateOne(
                { $push: { ngoname: ngoname } }
            )
        }
    }
    else {
        let temparr = [];
        temparr.push(ngoname);
        const obj = new reportschema();
        obj.username = username;
        obj.ngoname = temparr;
        await obj.save();
        console.log(obj.ngoname[0]);

        console.log("report saved successfully");

    }
})

const GetRating = asyncHandler(async (req, res) => {
    const rating = await reviewschema.find({ ngoname: req.body.payload });
    const obj = {
        payload: rating,
    }
    console.log(rating);
    res.status(200).send(obj);
})



module.exports = {
    Contact_details,
    Review,
    ReportNgos,
    GetRating
}