const express = require('express');
const app = express();
const port = 3000;
const musicController = require('./controllers/musicController');

app.use(express.json());

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