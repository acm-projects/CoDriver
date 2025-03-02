const express = require('express');
const bodyParser = require('body-parser');
const AIController = require('./controllers/aiController');
const commandController = require('./controllers/commandController');
const weatherController = require('./controllers/weatherController');
const musicController = require('./controllers/musicController');

const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// endpoint to handle user input and generate a response- might move to routes folder
app.post('/conversation', async (req, res) => {
  const { userInput } = req.body;


if (!userInput) {
  return res.status(400).json({ error: 'User input is required' });
}

try {
  const aiResponse = await AIController.handleUserInput(userInput);
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


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});