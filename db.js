const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: 'chiefs-assessment-db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID', db.threadId);
});

module.exports = db;
