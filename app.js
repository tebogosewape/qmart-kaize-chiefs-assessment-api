const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to get match schedule
app.get('/api/schedule', (req, res) => {
    const schedule = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'schedules.json'), 'utf-8'));
    res.json(schedule);
});

// Endpoint to get player profiles
app.get('/api/players', (req, res) => {
    const players = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'players.json'), 'utf-8'));
    res.json(players);
});

// Endpoint to get match results
app.get('/api/results', (req, res) => {
    const matchResults = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'match.json'), 'utf-8'));
    res.json(matchResults);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
