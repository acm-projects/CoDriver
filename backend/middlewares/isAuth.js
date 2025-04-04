const jwt = require("jsonwebtoken");

// Middleware to check if a user is authenticated
const isAuthenticated = async (req, res, next) => {
  //! Get the token from the header
  const headerObj = req.headers;
  const token = headerObj.authorization.split(" ")[1];

  // Verify token
  const verifyToken = jwt.verify(token, "anyKey", (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
  
  if (verifyToken) {
    // Save the user ID in request object
    req.user = verifyToken.id;
    next(); // Proceed to next middleware or route handler
  } else {
    const err = new Error("Token expired please login again");
    next(err); // Pass error to error handler
  }
};

module.exports = isAuthenticated;

