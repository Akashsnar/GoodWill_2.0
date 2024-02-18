// const mongoose = require("mongoose");


// const userSchema  = mongoose.Schema(
//     {
//         // profilepic: {
//         //   type: String,
//         //   required: [true, "Please add a photo"],
//         //   default: "https://i.ibb.co/4pDNDk1/avatar.png",
//         // },
//     name: {
//         type: String,
//         required: [true, "Please add a name"],
//       },
//     mode: {
//         type: String,
//         required: [true, "Please add a name"],
//       },
//       email: {
//         type: String,
//         required: [true, "Please add a email"],
//         unique: true,
//         trim: true,
//         match: [
//           /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//           "Please enter a valid email",
//         ],
//       },
//       password: {
//         type: String,
//         required: [true, "Please add a password"],
//         minLength: [6, "Password must be up to 6 characters"],
//       },

//       //userspecifc
//       profilePic: { type: String, default: "img.png"},
//       phone:{type: String },
//       dob: {type: String, trim: true},
//       gender: {type: String, trim: true},
//       details: {type: String, trim: true,  default: "No detail"}


//     },
//     {
//         timestamps: true,
//     }
//   );

// const User  = mongoose.model("User",userSchema);
// module.exports = User;


const mongoose = require("mongoose");


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    mode: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be up to 6 characters"],
    },
    


  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;