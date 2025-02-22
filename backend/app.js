const express = require('express');
const bodyParser = require('body-parser');
const AIController = require('./controllers/aiController');

const app = express();
const port = 3000;

// middleware
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

// to start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
