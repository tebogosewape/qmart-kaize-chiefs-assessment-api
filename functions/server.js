const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');

const app = express();
const router = express.Router();

// Middleware to parse JSON
app.use(express.json());

// Endpoint to get match schedule
router.get('/api/schedule', (req, res) => {
    const schedule = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'schedule.json'), 'utf-8'));
    res.json(schedule);
});

// Endpoint to get player profiles
router.get('/api/players', (req, res) => {
    const players = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'player.json'), 'utf-8'));
    res.json(players);
});

// Endpoint to get match results
router.get('/api/results', (req, res) => {
    const matchResults = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'match.json'), 'utf-8'));
    res.json(matchResults);
});

app.use('/.netlify/functions/server', router);

module.exports = app;
module.exports.handler = serverless(app);
