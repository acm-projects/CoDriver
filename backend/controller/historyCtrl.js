const asyncHandler = require("express-async-handler");
const Trip = require("../model/History");

const historyCtrl = {
  // Add a new trip
  addTrip: asyncHandler(async (req, res) => {
    const { destination, date } = req.body;
    const userId = req.user;
    
    if (!destination || !date) {
      res.status(400);
      throw new Error("Destination and date are required");
    }
    
    const newTrip = await Trip.create({
      userId,
      destination,
      date: new Date(date),
      conversations: []
    });
    
    res.status(201).json(newTrip);
  }),
  
  // Get all trips for a user
  getTrips: asyncHandler(async (req, res) => {
    const trips = await Trip.find({ userId: req.user })
      .select('destination date createdAt updatedAt')
      .sort({ date: -1 });
    
    const formattedTrips = trips.map(trip => ({
      id: trip._id,
      destination: trip.destination,
      date: trip.date,
      createdAt: trip.createdAt
    }));
    
    res.json(formattedTrips);
  }),
  
  // Get conversations of a specfic trip
  getTrip: asyncHandler(async (req, res) => {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user
    });
    
    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }
    
    // Extract only the conversations with their relevant fields
    const conversations = trip.conversations.map(convo => ({
      sender: convo.sender,
      message: convo.message,
      timestamp: convo.timestamp
    }));
    
    // Return only the conversations array
    res.json(conversations);
  }),
  
  // Add conversation to a trip
  addConversation: asyncHandler(async (req, res) => {
    const { userMessage, aiResponse } = req.body;
    
    if (!userMessage) {
      res.status(400);
      throw new Error("User message is required");
    }
    
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user,
      status: 'active'  // Only allow adding conversations to active trips
    });
    
    if (!trip) {
      res.status(404);
      throw new Error("Active trip not found");
    }
    
    // Add user message
    trip.conversations.push({
      sender: 'user',
      message: userMessage,
      timestamp: new Date()
    });
    
    // Add AI response if provided
    if (aiResponse) {
      trip.conversations.push({
        sender: 'codriver',
        message: aiResponse,
        timestamp: new Date()
      });
    }
    
    await trip.save();
    res.status(201).json(trip.conversations);
  }),

  //Adds only ai response to a trip's conversation
  addAIResponse: asyncHandler(async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
      res.status(400);
      throw new Error("AI response message is required");
    }
    
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user
    });
    
    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }
    
    trip.conversations.push({
      sender: 'codriver',
      message: message,
      timestamp: new Date()
    });
    
    await trip.save();
    res.status(201).json(trip.conversations);
  }),

  startTrip: asyncHandler(async (req, res) => {
    const { destination } = req.body;
    const userId = req.user;

    if(!destination){
        res.status(400);
        throw new Error("Destination is required");
    }

    // Check if there's already an active trip
    const existingActiveTrip = await Trip.findOne({
        userId,
        status: 'active'
    });

    if (existingActiveTrip) {
        res.status(400);
        throw new Error("You already have an active trip. Please end it before starting a new one.");
    }

    const newTrip = await Trip.create({
        userId,
        destination,
        date: new Date(),
        status: 'active',  // Explicitly set status to active
        conversations: []
    });

    res.status(201).json({
        message: "Trip started successfully",
        tripId: newTrip._id,
        destination: newTrip.destination,
        date: newTrip.date,
        status: newTrip.status
    });
  }),

  endTrip: asyncHandler(async (req, res) => {
    const {tripId} = req.params;

    const trip = await Trip.findOne({
        _id: tripId,
        userId: req.user,
        status: 'active'  // Ensure we're only ending active trips
    });

    if(!trip){
        res.status(404);
        throw new Error("Active trip not found");
    }

    // Update the trip status to completed
    trip.status = 'completed';
    await trip.save();

    res.json({
        message: "Trip ended successfully",
        tripId: trip._id,
        destination: trip.destination,
        date: trip.date,
        status: trip.status,
        conversationsCount: trip.conversations.length
    });
  })



};

module.exports = historyCtrl;



