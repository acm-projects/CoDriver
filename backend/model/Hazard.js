const mongoose = require('mongoose');

const hazardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['traffic', 'weather', 'roadwork', 'accident', 'police', 'other'],
    required: true
  },
  subtype: {
    type: String,
    enum: ['minor', 'moderate', 'severe', 'critical'],
    default: 'moderate'
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: String
  },
  description: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  active: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Hazards expire after 1 hour by default
      const now = new Date();
      return new Date(now.getTime() + 60 * 60 * 1000);
    }
  },
  confirmedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
hazardSchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Hazard', hazardSchema);
