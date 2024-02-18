const asyncHandler = require("express-async-handler");


const ngoDetailsDelete = asyncHandler(async (req, res) => {
    const it = req.body.checkbox;
    console.log(typeof it);
    ngoschemaregist.findByIdAndDelete(it)
        .then(function () {
            console.log("pass" + it);
            // res.redirect("/ngodetails");
        })
        .catch(function (err) {
            console.log(err);
        })
})

const userDetailsDelete = asyncHandler(async (req, res) => {

    console.log("post ho taha hai");
    const it = req.body.checkbox;
    mongoschema.findByIdAndDelete(it)
        .then(function (it) {
            console.log("pass");
            // res.redirect("/userdetails");
        })
        .catch(function (err) {
            console.log(err);

        })

})


const reviewdetailsDelete = asyncHandler(async (req, res) => {

    console.log("post ho taha  review me hai");
    const it = req.body.checkbox;
    reviewschema.findByIdAndDelete(it)
        .then(function (it) {
            console.log("pass");
            // res.redirect("/reviewdetails");
        })
        .catch(function (err) {
            console.log(err);

        })
})

const reportdetailsDelete = asyncHandler(async (req, res) => {

    console.log("ngo deleted deleted");
    await ngoschema.deleteMany({ username: req.body.checkbox })

        .catch(function (err) {
            console.log(err);
        })

    await reviewschema.deleteMany({ ngoname: req.body.checkbox })

        .catch(function (err) {
            console.log(err);
        })


    await ngoschemaregist.deleteOne({ username: req.body.checkbox })
        .catch(function (err) {
            console.log(err);
        })
    console.log("register deleted " + req.body.checkbox);

    await reportschema.updateMany(
        {},
        { $pull: { ngoname: { $in: req.body.checkbox } } }
    );

    res.redirect("/reportdetails");

})

const ContactDelete= asyncHandler(async(req, res)=>{
        const id = req.body.id;
        try {
          await Contact.findByIdAndDelete(id);
        //   res.redirect('/contactsDetails');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error');
        }
})

const GetReviews= asyncHandler(async(req,res)=>{
    let payload = req.body.payload;
  console.log(payload);
  let result = await reviewschema.find({ ngoname: payload });
  if (result != null) {
    console.log("result data");
    console.log(result);
    console.log(result.length);
    const obj = {
      payload: result,
    }
    res.status(200).send(obj);
  }
})

module.exports = {
    ngoDetailsDelete,
    userDetailsDelete,
    reviewdetailsDelete,
    reportdetailsDelete,
    ContactDelete,
    GetReviews
}
