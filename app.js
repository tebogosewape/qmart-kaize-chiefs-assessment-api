const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

const sendErrorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({ error: message });
};

const networks = ['vc', 'dm', 'tm', 'mt', 'mtn', 'hm'];

const validationRules = [

    body('user_name').notEmpty().withMessage('User name is required'),

    body('simcard_purchase')
        .isArray({ min: 1 }).withMessage('Sim card purchases must be an array with at least one item')
        .custom(simcard_purchase => {

            return simcard_purchase.every(purchase => {
                return (
                    typeof purchase.network === 'string' &&
                    networks.includes(purchase.network) &&
                    Number.isInteger(purchase.quantity) &&
                    purchase.quantity >= 1 && purchase.quantity <= 100
                );
            });
        }).withMessage('Each network must include a valid network ('+JSON.stringify(networks)+') and quantity between 1 and 100')
];


app.get('/api/schedule', (req, res) => {

    try {

        const schedule = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'schedules.json'), 'utf-8'));
        res.json(schedule);
    } catch (err) {
        
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

app.get('/api/players', (req, res) => {

    try {

        const players = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'players.json'), 'utf-8'));
        res.json(players);
    } catch (err) {

        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

app.get('/api/results', (req, res) => {

    try {

        const matchResults = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'match.json'), 'utf-8'));
        res.json(matchResults);
    } catch (err) {

        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

app.post('/api/comments', (req, res) => {

    const { name, comment } = req.body;
    const created_at = new Date();

    const query = 'INSERT INTO `fan-comments` (name, comment, created_at) VALUES (?, ?, ?)';

    db.query(query, [name, comment, created_at], (err, result) => {
        if (err) return sendErrorResponse(res, 500, 'Failed to add comment');
        res.status(201).json({ message: 'Comment added', id: result.insertId });
    });

});

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

app.post('/api/simcard', validationRules, (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() });
    }

    const { user_name, simcard_purchase } = req.body;

    const values = simcard_purchase.map(p => [user_name, p.network, p.quantity]);
    const query = 'INSERT INTO network_purchases (user_name, network, purchase_qty) VALUES ?';

    db.query(query, [values], (err, result) => {

        if (err) {

            console.log('err', err);
            return res.status(500).json({ error: 'Failed to add purchases' });
        }

        res.status(201).json({ message: 'Purchases added', ids: result.insertId });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
