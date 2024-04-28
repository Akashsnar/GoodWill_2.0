const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
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
    Subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Contact = mongoose.model('contacts', contactSchema);

module.exports = Contact