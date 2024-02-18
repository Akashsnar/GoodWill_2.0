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

// Getting One
router.get('/:id', getUser, (req, res) => {
  res.json(res.User)
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

    // const UserAuthEmail= payload.UserloginEmail;
    // const userExists = await UserAuthLogin.findOne({ email: UserAuthEmail });
    // if (!userExists) {
    //     res.status(400);
    //     throw new Error("User not found, please signup");
    //   }


    const newngomodel = new Ngomodel();
    console.log("i am working");
    // newngomodel.Id= userExists._id;
    newngomodel.ngoname = payload.campagainname ,
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
  let User
  try {
    User = await User.findById(req.params.id)
    if (User == null) {
      return res.status(404).json({ message: 'Cannot find User' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.User = User
  next()
}



module.exports = router