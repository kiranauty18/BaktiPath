const mongoose = require('mongoose');

const sevaPledgeSchema = new mongoose.Schema({
  devoteeName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SevaPledge', sevaPledgeSchema);