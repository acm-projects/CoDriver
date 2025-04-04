const express = require('express');
const bodyParser = require('body-parser');
const AIController = require('./controllers/aiController');
const commandController = require('./controllers/commandController');
const WebSocket = require('ws');
const axios = require('axios');
// const weatherController = require('./controllers/weatherController');
const musicController = require('./controllers/musicController');
const directionsController = require('./controllers/directionsController');
const hazardController = require('./controllers/hazardController');
const http = require('http');
const NavigationController = require('./controllers/navigationController');
const { start } = require('repl');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// endpoints to handle user input and generate a response- might move to routes folder

// endpoint goes directly to aiController, skipping commandController
// app.post('/conversation', async (req, res) => {
//   const { userInput } = req.body;


// if (!userInput) {
//   return res.status(400).json({ error: 'User input is required' });
// }

// try {
  
//   const aiResponse = await AIController.handleUserInput(userInput);
//   //const aiResponse = await AIController.getDeepSeekResponse(userInput);
//   res.json({
//     message: 'Conversation successful',
//     userInput,
//     aiResponse,
//   });

// } catch (error) {
//   console.error('Error handling conversation:', error);
//   res.status(500).json({ error: 'Failed to generate response' });
// }
// });

// endpoimt for command controller (music, weather, etc)
app.post('/command', async (req, res) => {
  const { command, userInput, destination, sessionId = 'default' } = req.body;
  city = null;
  // Handle both command and userInput
  const inputText = command || userInput;

  if (!inputText) {
    return res.status(400).json({ error: 'Command or userInput is required' });
  }

  if(destination) {
    const cityRegex = /,\s*([^,]+),\s*\w{2}\s*\d{5}/;
    const match = destination.match(cityRegex);
    city = match ? match[1].trim() : null;

    if (!city) {
      console.log("no city found")
      city = "Dallas"; // default city
      //return res.status(400).json({ error: 'Unable to extract city from destination' });

    }
    console.log("city found: " + city);


  }

  try {
    // Process through command controller which will handle both specific commands and AI conversations
    const response = await commandController.processCommand(inputText, sessionId, city);
    res.json(response);
  } catch (error) {
    console.error('Error processing command/conversation:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
  
});

// music control routes
app.post('/api/music/play', async (req, res) => {
  const result = await musicController.play();
  res.json(result);
});

app.post('/api/music/pause', async (req, res) => {
  const result = await musicController.pause();
  res.json(result);
});

app.post('/api/music/next', async (req, res) => {
  const result = await musicController.skipToNext();
  res.json(result);
});

app.post('/api/music/previous', async (req, res) => {
  const result = await musicController.skipToPrevious();
  res.json(result);
});

// Authentication routes
app.get('/api/music/login', async (req, res) => {
  const result = await musicController.login();
  res.json(result);
});

app.get('/api/music/callback', async (req, res) => {
  const result = await musicController.callback(req.query.code);
  res.json(result);
});
// create a route that gets the current song playlist cover
app.get("/api/music/currentSongCover", async (req, res) => {
  const result = await musicController.getAlbumCover();
  res.json(result);
});

// create a route that gets the current song  artist, album, and title
app.get("/api/music/currentSong", async (req, res) => {
  const result = await musicController.getCurrentSong();
  res.json(result);
});

app.get('/api/directions', async (req, res) => {
  const { origin, destination } = req.query;
  
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  try {
    const result = await directionsController.getDirections(origin, destination);
    res.json(result);
  } catch (error) {
    console.error('Error fetching directions:', error);
    res.status(500).json({ error: 'Failed to fetch directions' });
  }
});

// new endpoint to handle location simulation
app.post('/api/simulation/location', (req, res) => {
  const { lat, lng, accuracy } = req.body;
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Latitude and longitude are required numbers' });
  }

  try {
    NavigationController.updateSimulatedPosition({ lat, lng, accuracy });
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating simulated location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// new endpoint to enable/disable simulation mode
app.post('/api/simulation/mode', (req, res) => {
  const { enabled } = req.body;
  
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'Enabled parameter must be a boolean' });
  }

  try {
    if (enabled) {
      NavigationController.enableSimulationMode();
    } else {
      NavigationController.disableSimulationMode();
    }
    res.json({ message: `Simulation mode ${enabled ? 'enabled' : 'disabled'} successfully` });
  } catch (error) {
    console.error('Error toggling simulation mode:', error);
    res.status(500).json({ error: 'Failed to toggle simulation mode' });
  }
});

// Add this new route to your Express app
app.post('/api/navigation/generate-route', async (req, res) => {
    try {
        const { origin, destination } = req.body;
        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const points = await NavigationController.generateRoutePoints(origin, destination);
        res.json({ points });
    } catch (error) {
        console.error('Error generating route points:', error);
        res.status(500).json({ error: error.message });
    }
});

// 
app.post('/api/navigation/start', async (req, res) => {
    try {
        const { origin, destination } = req.body;
        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const result = await NavigationController.startNavigation(origin, destination);
        res.json(result);
    } catch (error) {
        console.error('Error starting navigation:', error);
        res.status(500).json({ error: error.message });
    }
});

// set up WebSocket connection
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    // Add error handling
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // add ping/pong to keep connection alive
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000);

    // handle navigation and hazard events
    ws.on('message', async (message) => {
        try {
            let data;
            try {
                data = JSON.parse(message.toString());
            } catch (parseError) {
                console.error('Error parsing message:', parseError);
                ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
                return;
            }
            
            if (data.type === 'startNavigation') {
                console.log('Starting navigation from:', data.origin, 'to:', data.destination);
                const result = await NavigationController.startNavigation(
                    data.origin,
                    data.destination
                );
                
                // Start hazard monitoring with the origin position
                try {
                    await hazardController.startHazardMonitoring(data.origin);
                    console.log('Hazard monitoring started');
                } catch (hazardError) {
                    console.error('Error starting hazard monitoring:', hazardError);
                }
                
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(result));
                }
            } else if (data.type === 'stopNavigation') {
                NavigationController.stopNavigation();
                hazardController.stopHazardMonitoring();
                ws.send(JSON.stringify({ type: 'stopped', message: 'Navigation and hazard monitoring stopped' }));
            } else {
                console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ error: 'Failed to process message' }));
            }
        }
    });

    // handle hazard events
    hazardController.on('newHazard', (hazardInfo) => {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify({
                    type: 'hazard',
                    data: {
                        type: hazardInfo.type,
                        severity: hazardInfo.severity,
                        location: {
                            lat: hazardInfo.location.lat,
                            lng: hazardInfo.location.lng
                        },
                        description: hazardInfo.description,
                        distance: hazardInfo.distance,
                        aiResponse: hazardInfo.aiResponse,
                        timestamp: new Date().toISOString()
                    }
                }));
            } catch (error) {
                console.error('Error sending hazard update:', error);
            }
        }
    });

    // handle no hazard events
    hazardController.on('noHazard', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify({
                    type: 'noHazard',
                    data: {
                        message: 'No hazards detected in the area',
                        position: data.position,
                        timestamp: data.timestamp
                    }
                }));
            } catch (error) {
                console.error('Error sending no hazard update:', error);
            }
        }
    });

    NavigationController.on('newInstruction', async (instruction) => {
      try {
        ws.send(JSON.stringify({
          type: 'instruction',
          data: {
            ...instruction,
          }
        }));
      } catch (error) {
        console.error('Error sending instruction:', error);
      }
    });

    NavigationController.on('approachingTurn', async (event) => {
        if (ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({
                type: 'approachingTurn',
                data: {
                  ...event,
                }
              }));
            } catch (error) {
              console.error('Error sending approaching turn:', error);
            }
        }
    });

    NavigationController.on('navigationComplete', () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'complete',
                data: {
                    message: "Great job! You've reached your destination.",
                    timestamp: new Date().toISOString()
                }
            }));
        }
        // stop hazard monitoring when navigation is complete
        hazardController.stopHazardMonitoring();
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
        NavigationController.stopNavigation();
        hazardController.stopHazardMonitoring();
    });
});

// Add hazard routes
app.post('/api/hazards/start', async (req, res) => {
    const { position } = req.body;
    if (!position || !position.lat || !position.lng) {
        return res.status(400).json({ error: 'Valid position is required' });
    }
    const result = await hazardController.startHazardMonitoring(position);
    res.json(result);
});

app.post('/api/hazards/stop', (req, res) => {
    const result = hazardController.stopHazardMonitoring();
    res.json(result);
});

app.get('/api/hazards/current', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    const result = await hazardController.getCurrentHazards({ lat: parseFloat(lat), lng: parseFloat(lng) });
    res.json(result);
});

// Add these routes to your Express app
app.post('/api/simulation/enable', (req, res) => {
    try {
        NavigationController.isSimulationMode = true;
        console.log('Simulation mode enabled through /api/simulation/enable');
        res.json({ message: 'Simulation mode enabled' });
    } catch (error) {
        console.error('Error enabling simulation mode:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/simulation/location', (req, res) => {
    try {
        const { lat, lng } = req.body;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }
        
        NavigationController.updateSimulatedPosition({ lat: Number(lat), lng: Number(lng) });
        res.json({ message: 'Location updated' });
    } catch (error) {
        console.error('Error updating simulated location:', error);
        res.status(500).json({ error: error.message });
    }
});



// simulation test route
app.post('/api/simulation/test', (req, res) => {
  const { origin, destination } = req.body;
  NavigationController.startNavigationTest(origin, destination);
  res.json({ message: 'Simulation test started' });
});


app.post("/startSimulationDirections", async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: 'Destination is required' });
  }

  try {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.on('open', async () => {
      console.log('Connected to server');

      // Enable simulation mode
      await axios.post('http://localhost:3000/api/simulation/enable');

      // Start navigation
      const response = await axios.post('http://localhost:3000/api/navigation/start', {
        origin: "16080 Lyndon B Johnson Fwy, Mesquite, TX 75150",
        destination
      });

      // Get route points from the response
      const routePoints = response.data.routePoints;
      console.log(`Simulating navigation through ${routePoints.length} points`);

      // Start hazard monitoring with the first point
      try {
        await hazardController.startHazardMonitoring(routePoints[0]);
        console.log('Hazard monitoring started');
      } catch (hazardError) {
        console.error('Error starting hazard monitoring:', hazardError);
      }

      // Simulate movement through the route points
      for (const point of routePoints) {
        await updatePosition(point.lat, point.lng);
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds between updates
      }

      // Stop hazard monitoring and navigation when complete
      hazardController.stopHazardMonitoring();
      NavigationController.stopNavigation();
    });

    // Handle WebSocket messages
    ws.on('message', (data) => {
      const message = JSON.parse(data);
      console.log('Received:', message);
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Handle WebSocket close
    ws.on('close', () => {
      console.log('Disconnected from server');
      hazardController.stopHazardMonitoring();
      NavigationController.stopNavigation();
    });

    res.json({ message: 'Simulation started successfully' });
  } catch (error) {
    console.error('Error in simulation:', error);
    res.status(500).json({ error: 'Failed to start simulation' });
  }
});

// Update the updatePosition function to handle hazard monitoring
async function updatePosition(lat, lng) {
  try {
    // Update the app's simulated location
    await axios.post('http://localhost:3000/api/simulation/location', {
      lat,
      lng,
      accuracy: 10
    });
    
    // Only check for hazards if we're not already monitoring on an interval
    if (hazardController.isMonitoring && !hazardController.watchId) {
      await hazardController.checkForHazards({ lat, lng });
    }
    
    console.log(`Updated position to: ${lat}, ${lng}`);
  } catch (error) {
    console.error('Error updating position:', error);
  }
}

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});