const express = require("express");
const historyCtrl = require("../controller/historyCtrl");
const isAuthenticated = require("../middlewares/isAuth");
const router = express.Router();

// Add trip route
router.post('/trip', isAuthenticated, historyCtrl.addTrip);

// Get all trips for authenticated user
router.get('/trips', isAuthenticated, historyCtrl.getTrips);

// Add conversation to a trip
router.post('/trip/:tripId/conversation', isAuthenticated, historyCtrl.addConversation);

// Add only AI response to a trip's conversation
router.post('/trip/:tripId/ai-response', isAuthenticated, historyCtrl.addAIResponse);

// Get conversation for a specific trip
router.get('/trip/:tripId', isAuthenticated, historyCtrl.getTrip);

//Start a new trip
router.post('/start-trip', isAuthenticated, historyCtrl.startTrip);


module.exports = router;



