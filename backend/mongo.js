// Import the mongoose library for MongoDB connection and schema creation
const mongoose = require("mongoose");

// Connect to the MongoDB database (local instance)
mongoose.connect("mongodb://127.0.0.1:27017/LoginFormPractice")
    .then(() => {
        console.log('mongoose connected'); // Log success message if connection is successful
    })
    .catch((e) => {
        console.log('failed'); // Log failure message if connection fails
    });

// Define the schema for the login collection
const logInSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true // Email field is required
    },
    password: {
        type: String,
        required: true // Password field is required
    }
});

// Create a model named 'LogInCollection' using the schema
const LogInCollection = new mongoose.model('LogInCollection', logInSchema);

// Export the model for use in other parts of the application
module.exports = LogInCollection;
