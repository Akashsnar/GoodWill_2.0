const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    NgoName: {
      type: String,
      required: [true, "Please add Ngo name"],
    },
    campaignName: {
      type: String,
      required: [true, "Please add Ngo name"],
    },
    EventName: {
      type: String,
      required: [true, "Please add event name"],
    },
    Location: {
      type: String,
      required: [true, "Please add location of the event"],
    },
    Details: {
      type: String,
      default:"No description"
    },
    Duration: {
      type: String,
      required: [true, "Please add "],
    },
    DateRange: {
      type: {
        startDate: {
          type: Date,
          default: "Not Determined", // Set default value for startDate
        },
        endDate: {
          type: Date,
          default: "Not Determined", // Set default value for endDate
        },
      },
      required: [true, "Please add "],
    },
    EventPic: { type: String, 
      default: "https://www.indiafilings.com/learn/wp-content/uploads/2023/03/What-is-difference-between-NGO-and-Section-8-company.jpg"},
  
      ParticipatedUser:  [String]
      
    },
  
  { timestamps: true }
);

const Events = mongoose.model("Events", EventSchema);
module.exports = Events;
