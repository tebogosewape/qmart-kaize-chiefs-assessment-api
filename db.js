const mysql = require('mysql');

const dbConfig = {
    host: 'localhost',
    user: '',
    password: '',
    database: 'chiefs-assessment-db'
};

let connection;

function handleDisconnect() {

    connection = mysql.createConnection(dbConfig);

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database:', err);
            setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
        } else {
            console.log('Connected to database');
        }
    });

    connection.on('error', err => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Reconnect on connection loss
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = connection;
