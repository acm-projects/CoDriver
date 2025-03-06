// Import required modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const validator = require("validator"); // For email validation
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

// ✅ Email Validation Function (Using Validator.js)
const isValidEmail = (email) => validator.isEmail(email);

// ✅ Password Validation Function (Without Regex)
const isValidPassword = (password) => {
    return (
        password.length >= 8 &&                      // At least 8 characters
        /[A-Z]/.test(password) &&                   // At least one uppercase letter
        /[a-z]/.test(password) &&                   // At least one lowercase letter
        /[0-9]/.test(password) &&                   // At least one number
        /[!@#$%^&*(),.?":{}|<>]/.test(password)     // At least one special character
    );
};

// POST route for user signup
app.post('/signup', async (req, res) => {
    console.log('Signup request received:', req.body); // Logging the received request body

    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate Email
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate Password
    if (!isValidPassword(password)) {
        return res.status(400).json({
            message: "Weak password. Must be 8+ chars, include uppercase, lowercase, number, and special char."
        });
    }

    try {
        // Check if the user already exists in the database
        const checking = await LogInCollection.findOne({ email });

        if (checking) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Insert new user data into MongoDB
        const newUser = { email, password };
        await LogInCollection.insertMany([newUser]);
        console.log('User inserted:', newUser);

        res.status(201).json({ message: "Signup successful", user: email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during signup" });
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
