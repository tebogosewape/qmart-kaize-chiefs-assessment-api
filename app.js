const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware to parse JSON
app.use(express.json());

// Helper function for error responses
const sendErrorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({ error: message });
};

// Endpoint to get match schedule
app.get('/api/schedule', (req, res) => {
    try {
        const schedule = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'schedules.json'), 'utf-8'));
        res.json(schedule);
    } catch (err) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

// Endpoint to get player profiles
app.get('/api/players', (req, res) => {
    try {
        const players = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'players.json'), 'utf-8'));
        res.json(players);
    } catch (err) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

// Endpoint to get match results
app.get('/api/results', (req, res) => {
    try {
        const matchResults = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'match.json'), 'utf-8'));
        res.json(matchResults);
    } catch (err) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

// Endpoint to add a comment
app.post('/api/comments', (req, res) => {
    const { name, comment } = req.body;
    const created_at = new Date();

    const query = 'INSERT INTO `fan-comments` (name, comment, created_at) VALUES (?, ?, ?)';
    db.query(query, [name, comment, created_at], (err, result) => {
        if (err) return sendErrorResponse(res, 500, 'Failed to add comment');
        res.status(201).json({ message: 'Comment added', id: result.insertId });
    });
});

// Endpoint to reply to a comment
app.post('/api/comments/:commentId/reply', (req, res) => {
    const { commentId } = req.params;
    const { fan_name, fan_reply } = req.body;
    const created_at = new Date();

    const query = 'INSERT INTO `fan-comment-reply` (comment_id, fan_name, fan_reply, created_at) VALUES (?, ?, ?, ?)';
    db.query(query, [commentId, fan_name, fan_reply, created_at], (err, result) => {
        if (err) return sendErrorResponse(res, 500, 'Failed to add reply');
        res.status(201).json({ message: 'Reply added', id: result.insertId });
    });
});

// Endpoint to get all comments or filter by comment ID and replies
app.get('/api/comments', (req, res) => {
    const { commentId } = req.query;

    let query;
    if (commentId) {
        query = `
            SELECT c.id, c.name, c.comment, c.created_at, r.id as reply_id, r.fan_name, r.fan_reply, r.created_at as reply_created_at
            FROM \`fan-comments\` c
            LEFT JOIN \`fan-comment-reply\` r ON c.id = r.comment_id
            WHERE c.id = ?
        `;
    } else {
        query = `
            SELECT c.id, c.name, c.comment, c.created_at, r.id as reply_id, r.fan_name, r.fan_reply, r.created_at as reply_created_at
            FROM \`fan-comments\` c
            LEFT JOIN \`fan-comment-reply\` r ON c.id = r.comment_id
        `;
    }

    db.query(query, [commentId], (err, results) => {
        if (err) return sendErrorResponse(res, 500, 'Failed to retrieve comments');
        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
