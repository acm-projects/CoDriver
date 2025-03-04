// Import required modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const LogInCollection = require("./mongo"); // Import the MongoDB collection model

const app = express();
const port = process.env.PORT || 3000; // Set the port, using environment variable or default to 3000

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for cross-origin requests
app.use(cors());

// Define path for serving static files (if needed)
const publicPath = path.join(__dirname, '../public'); // Path to public static files
app.use(express.static(publicPath)); // Serve static files from the public directory
console.log(publicPath); // Log the public path for debugging

// Test route to check if the server is running
app.get('/', (req, res) => {
    res.json({ message: "Server is running!" });
});

// POST route for user signup
app.post('/signup', async (req, res) => {
    console.log('Signup request received:', req.body); // Logging the received request body

    // Extract user data from request body
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        // Check if the user already exists in the database
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            return res.status(400).json({ message: "User already exists" }); // Respond with a proper status code
        } 

        // Insert new user data into MongoDB
        await LogInCollection.insertMany([data]);
        console.log('User inserted:', data);

        res.status(201).json({ message: "Signup successful", user: req.body.name }); // Respond with success
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during signup" }); // Handle errors properly
    }
});

// POST route for user login
app.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body); // Log incoming login request

        // Find user in the database
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (!check) {
            return res.status(401).json({ message: "User does not exist" }); // Respond if user is not found
        }

        // Validate password
        if (check.password !== req.body.password) {
            return res.status(401).json({ message: "Incorrect password" }); // Respond if password is incorrect
        }

        // Respond with success message and user data
        res.status(200).json({
            message: "Login successful",
            user: req.body.name
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" }); // Handle errors properly
    }
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
