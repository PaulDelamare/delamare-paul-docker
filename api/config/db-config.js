// IMPORTS
const mysql = require('mysql2');

// Création de la fonction permettant l'intéraction avec la bdd
const connectWithRetry = () => {
    const db = mysql.createPool({
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'mybooksdb',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            setTimeout(connectWithRetry, 2000);
        } else {
            console.log('Connected to database');
            connection.release();
        }
    });

    return db;
}

const db = connectWithRetry();

// EXPORT
module.exports = db;