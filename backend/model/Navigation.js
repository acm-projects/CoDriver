const mongoose = require('mongoose');

const navigationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  origin: {
    type: {
      lat: Number,
      lng: Number,
      address: String
    },
    required: true
  },
  destination: {
    type: {
      lat: Number,
      lng: Number,
      address: String
    },
    required: true
  },
  route: {
    distance: String,
    duration: String,
    polyline: String, // Encoded polyline for the route
    steps: [{
      instruction: String,
      distance: String,
      duration: String,
      maneuver: String,
      polyline: String
    }]
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  hazardsEncountered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hazard'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Navigation', navigationSchema);
