const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    did_you_find_what_you_needed: {
      type: String,
      required: true,
    },
    Is_this_the_first_time_you_have_visited_the_website: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("feedback", feedbackSchema);

module.exports = Feedback;
