const mongoose = require("mongoose");



// Define the user schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true }, // Email field, required
    password: { type: String, required: true }, // Password field, required
    aiSettings: {
      temperature: { type: Number, default: 0.8 },
      humorLevel: { type: Number, default: 0.5 },
      frequency: { type: Number, default: 1 },
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  },
  
  
);

// Compile the schema into a model
module.exports = mongoose.model("User", userSchema);


