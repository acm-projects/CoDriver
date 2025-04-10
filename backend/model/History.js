const mongoose = require('mongoose');

//Defining the trip collection schema
const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  destination: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  date: {type: Date, required: true},
  conversations: [{
    sender: {type: String, enum: ['user', 'codriver'], required: true},
    message: {type: String, required: true},
    timestamp: { type: Date, default: Date.now}
  }]

}, { timestamps: true});

module.exports = mongoose.model("Trip", tripSchema);