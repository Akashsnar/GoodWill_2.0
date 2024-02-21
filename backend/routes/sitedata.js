const express = require('express')
const router = express.Router()
const User = require('../mongoSchema/userdetails')
const Ngos = require('../mongoSchema/ngoschema')
const Review = require("../mongoSchema/reviewschema");
const Contact = require("../mongoSchema/contactSchema");
const Ngomodel = require("../mongoSchema/mongoschemango");

// Getting all
router.get('/', async (req, res) => {
  try {
    const user = await User.find()
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/ngodetails', async (req, res) => {
  try {
    const ngomodel = await Ngomodel.find()
    res.json(ngomodel)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/ngodetail/:ngoid', async (req, res) => {
  const campagainid=req.params.ngoid;
  console.log(campagainid);
  try {
    let query = {_id: campagainid};
    const ngomodel = await Ngomodel.findOne(query)
    console.log(ngomodel);
    res.json(ngomodel)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})
router.get('/allUsers', async (req, res) => {
  try {
    const User = await User.find()
    res.json(User)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



router.get('/userlength', async (req, res) => {
  try {
    const user = await User.find()
    res.json(user.length);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/ngolength', async (req, res) => {
  try {
    const ngos = await Ngos.find()
    res.json(ngos.length)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


router.get('/reviewlength', async (req, res) => {
  try {
    const review = await Review.find()
    res.json(review.length)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/messageslength', async (req, res) => {
  try {
    const contact = await Contact.find()
    res.json(contact)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



router.get('/ngodetail', async (req, res) => {
  try {
    const ngo = await Ngos.find()
    res.json(ngo)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


router.get("/campaign/:name", async(req, res, next) => {
  try {
     const name=req.params.name;
     console.log(name);
     const regex = new RegExp(name, 'i');
     const Campaign_details = await Ngomodel.find({ campagainname : regex});
     console.log(Campaign_details[0]);
     res.json(Campaign_details[0])
   } catch (err) {
     res.status(500).json({ message: err.message })
   }
 })

// Getting One use detail
router.get('/userdetail/:userid', async (req, res) => {
  console.log("i am triggered");
  const User_Id=req.params.userid;
  console.log(User_Id);
  try {
    let query = {Id: User_Id};
    const Result = await User.findOne(query)
    console.log(Result);
    res.json(Result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})

// Creating one
router.post('/', async (req, res) => {
  const User = new User({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel
  })
  try {
    const newUser = await User.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// router.get('/userdetail/:id', getUser, (req, res) => {


router.post('/submitmessage', async (req, res) => {
  try {
    // console.log(req.body)
    // Create a new document using the FormData model
    const newContact = new Contact(req.body);
    console.log(newContact)
    // Save the document to the database
    await newContact.save();

    // Send a response back to the client
    res.status(200).json({ message: 'Form data submitted successfully' });
  } catch (error) {
    console.error('Error submitting form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/ngo_details', async (req, res) => {  
  try {
    console.log(req.body);
    const payload=req.body;
    const newngomodel = new Ngomodel();
    console.log("i am working");
    // newngomodel.Id= userExists._id;
    newngomodel.ngoname = payload.ngoname ,
    newngomodel.campagainname = payload.campagainname ,
    newngomodel.category = payload.category ,
    newngomodel.goal=payload.goal,
    newngomodel.desc=payload.desc,
    newngomodel.image=payload.image
    newngomodel.raised=payload.raised

    
          //  profilePic: req.file.filename

   
      // let filter = {username : req.session.user.username};
      // console.log(filter);
      // const result = await User.updateOne({},newngomodel);
      await newngomodel.save()
      .then(() => {
                console.log("saved successfully");
              //   res.redirect("/users");
              })


    res.status(201).json({ message: 'Uploaded Succesfully' });
  } catch (err) {
    console.error(err); // Log the error to the console for debugging
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// Updating One
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.name != null) {
    res.User.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.User.subscribedToChannel = req.body.subscribedToChannel
  }
  try {
    const updatedUser = await res.User.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.User.remove()
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    // User = "Hi i am"

    if (user == null) {
      return res.status(404).json({ message: 'Cannot find User' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.User = user
  next()
}



module.exports = router