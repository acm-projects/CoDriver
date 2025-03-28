const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

// Import controllers
const AIController = require("./controllers/aiController");
const commandController = require("./controllers/commandController");
const musicController = require("./controllers/musicController");
const directionsController = require("./controllers/directionsController");
const hazardController = require("./controllers/hazardController");
const NavigationController = require("./controllers/navigationController");
const WeatherController = require("./controllers/weatherController"); // Import WeatherController

// Import routes
const router = require("./routes/users");
const historyRoutes = require("./routes/history");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 8000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Db connected successfully"))
  .catch((e) => console.log(e));

// Routes for users and history
app.use("/", router);
app.use("/api/history", historyRoutes);

// AI conversation endpoint
app.post("/conversation", async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "User input is required" });
  }

  try {
    const aiResponse = await AIController.handleUserInput(userInput);
    res.json({
      message: "Conversation successful",
      userInput,
      aiResponse,
    });
  } catch (error) {
    console.error("Error handling conversation:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Command controller endpoint
app.post("/command", async (req, res) => {
  const { command, userInput, sessionId = "default" } = req.body;
  const inputText = command || userInput;

  if (!inputText) {
    return res.status(400).json({ error: "Command or userInput is required" });
  }

  try {
    const response = await commandController.processCommand(inputText, sessionId);
    res.json(response);
  } catch (error) {
    console.error("Error processing command/conversation:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Music control routes
app.post("/api/music/play", async (req, res) => {
  const result = await musicController.play();
  res.json(result);
});

app.post("/api/music/pause", async (req, res) => {
  const result = await musicController.pause();
  res.json(result);
});

app.post("/api/music/next", async (req, res) => {
  const result = await musicController.skipToNext();
  res.json(result);
});

app.post("/api/music/previous", async (req, res) => {
  const result = await musicController.skipToPrevious();
  res.json(result);
});

// Authentication routes for music
app.get("/api/music/login", async (req, res) => {
  const result = await musicController.login();
  res.json(result);
});

app.get("/api/music/callback", async (req, res) => {
  const result = await musicController.callback(req.query.code);
  res.json(result);
});

// Current song and album cover
app.get("/api/music/currentSongCover", async (req, res) => {
  const result = await musicController.getAlbumCover();
  res.json(result);
});

app.get("/api/music/currentSong", async (req, res) => {
  const result = await musicController.getCurrentSong();
  res.json(result);
});

// Directions route
app.get("/api/directions", async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: "Origin and destination are required" });
  }

  try {
    const result = await directionsController.getDirections(origin, destination);
    res.json(result);
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: "Failed to fetch directions" });
  }
});

// Weather endpoint with enhanced logging and error handling
app.post("/weather", async (req, res) => {
  const { city } = req.body;

  console.log("Received weather request body:", req.body);

  if (!city) {
    console.error("City is not provided in the request body.");
    return res.status(400).json({ error: "City is required" });
  }

  try {
    console.log(`Fetching weather data for city: ${city}`);

    // Fetch weather data from WeatherController
    const weatherData = await WeatherController.getWeather(city);
    
    //console.log("Weather data fetched:", weatherData);

    if (!weatherData.success) {
      console.error("Failed to fetch weather data:", weatherData);
      return res.status(500).json({ error: "Unable to fetch weather data" });
    }

    // Format weather response
    const weatherResponse = await WeatherController.formatWeatherResponse(weatherData);
    console.log("Formatted weather response:", weatherResponse);

    res.json({ weather: weatherResponse });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// WebSocket for navigation and hazards
wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  // Add error handling
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Keep connection alive with ping/pong
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000);

  // Handle navigation and hazard events
  ws.on("message", async (message) => {
    try {
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch (parseError) {
        console.error("Error parsing message:", parseError);
        ws.send(JSON.stringify({ error: "Invalid JSON format" }));
        return;
      }

      if (data.type === "startNavigation") {
        const result = await NavigationController.startNavigation(data.origin, data.destination);
        await hazardController.startHazardMonitoring(data.origin);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(result));
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ error: "Failed to process message" }));
      }
    }
  });

  // Handle hazard events
  hazardController.on("newHazard", (hazardInfo) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "hazard",
        data: {
          type: hazardInfo.type,
          subtype: hazardInfo.subtype,
          location: hazardInfo.location,
          description: hazardInfo.description,
          distance: hazardInfo.distance
        }
      }));
    }
  });

  // Handle navigation events
  NavigationController.on("newInstruction", (instruction) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "instruction",
        data: instruction
      }));
    }
  });

  NavigationController.on("navigationComplete", () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "complete",
        message: "You have reached your destination"
      }));
    }
    hazardController.stopHazardMonitoring();
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
    NavigationController.stopNavigation();
    hazardController.stopHazardMonitoring();
  });
});

// Hazard routes
app.post("/api/hazards/start", async (req, res) => {
  const { position } = req.body;
  if (!position || !position.lat || !position.lng) {
    return res.status(400).json({ error: "Valid position is required" });
  }
  const result = await hazardController.startHazardMonitoring(position);
  res.json(result);
});

app.post("/api/hazards/stop", (req, res) => {
  const result = hazardController.stopHazardMonitoring();
  res.json(result);
});

app.get("/api/hazards/current", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }
  const result = await hazardController.getCurrentHazards({ lat: parseFloat(lat), lng: parseFloat(lng) });
  res.json(result);
});

// Global error handler
app.use(errorHandler);

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
