// ! IMPORTS

const db = require("../../config/db-config");

// ! Find All
exports.findAll = async (req, res) => {
    db.query('SELECT * FROM genres', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching data from database');
        } else {
            res.json(results);
        }
    });
};