const express = require('express');
const bodyParser = require('body-parser');
const AIController = require('./controllers/aiController');
const commandController = require('./controllers/commandController');
const weatherController = require('./controllers/weatherController');
const musicController = require('./controllers/musicController');
const directionsController = require('./controllers/directionsController');
const http = require('http');
const WebSocket = require('ws');
const NavigationController = require('./controllers/navigationController');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// endpoint to handle user input and generate a response- might move to routes folder

// endpoint goes directly to aiController, skipping commandController
app.post('/conversation', async (req, res) => {
  const { userInput } = req.body;


if (!userInput) {
  return res.status(400).json({ error: 'User input is required' });
}

try {
  
  const aiResponse = await AIController.handleUserInput(userInput);
  //const aiResponse = await AIController.getDeepSeekResponse(userInput);
  res.json({
    message: 'Conversation successful',
    userInput,
    aiResponse,
  });

} catch (error) {
  console.error('Error handling conversation:', error);
  res.status(500).json({ error: 'Failed to generate response' });
}
});

// endpoimt for command controller (music, weather, etc)
app.post('/command', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const response = await commandController.processCommand(command);
    res.json(response);
  } catch (error) {
    console.error('Error processing command:', error);
    res.status(500).json({ error: 'Failed to process command' });
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


// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });




// Set up WebSocket connection
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    // Add error handling
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // Add ping/pong to keep connection alive
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000);

    // Handle navigation requests
    ws.on('message', async (message) => {
        try {
            // Log the raw message first
            console.log('Raw message received:', message);
            console.log('Message type:', typeof message);
            
            let data;
            try {
                data = JSON.parse(message.toString());
                console.log('Parsed data:', data);
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
                console.log('Sending initial navigation result:', result);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(result));
                }
            } else {
                console.log('⚠️ Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ error: 'Failed to process message' }));
            }
        }
    });

    // Handle navigation events
    NavigationController.on('newInstruction', (instruction) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'instruction',
                data: instruction
            }));
        }
    });

    NavigationController.on('navigationComplete', () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'complete',
                message: 'You have reached your destination'
            }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
        NavigationController.stopNavigation();
    });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});