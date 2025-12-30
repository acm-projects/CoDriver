const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const userCtrl = {
  //! Register new user
  register: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log({ email, password });
    
    //! Validate input fields
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    
    //! Check if user already exists
    const userExits = await User.findOne({ email });
    if (userExits) {
      throw new Error("User already exists");
    }
    
    //! Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    //! Create and save new user in database
    const userCreated = await User.create({
      password: hashedPassword,
      email,
    });
    
    //! Send success response
    console.log("User created", userCreated);
    res.json({
      email: userCreated.email,
      id: userCreated.id,
    });
  }),
  
  //! Login user
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    //! Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    //! Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    
    //! Generate JWT token
    const token = jwt.sign({ id: user._id }, "anyKey", { expiresIn: "30d" });
    
    //! Send response with token
    res.json({
      message: "Login success",
      token,
      id: user._id,
      email: user.email,
    });
  }),
  
  //! Fetch user profile (protected route)
  profile: asyncHandler(async (req, res) => {
    // Find user by ID excluding password field
    const user = await User.findById(req.user).select("-password");
    res.json({ user });
  }),
};

module.exports = userCtrl;