// ! IMPORTS

const db = require("../../config/db-config");

// ! Find All
exports.findAll = async (req, res) => {
    const { genre } = req.query;

    let sql = 'SELECT * FROM books';
    let params = [];

    if (genre) {
        sql = `
          SELECT books.* FROM books
          JOIN books_genres ON books.id = books_genres.book_id
          JOIN genres ON books_genres.genre_id = genres.id
          WHERE genres.id = ?
        `;
        params = [genre];
    }

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching data from database');
        } else {
            res.json(results);
        }
    });
};


exports.create = async (req, res) => {
    const { name, author, genres } = req.body;

    if (!name || !author) {
        return res.status(400).send('Le nom du livre et de l\'auteur sont requis');
    }

    db.query('INSERT INTO books (name, author) VALUES (?, ?)', [name, author], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error inserting data into database');
        } else {
            const newBookId = results.insertId;
            // 🚀 Si des genres sont fournis, on les associe au livre via la table intermédiaire "books_genre"
            if (genres && Array.isArray(genres) && genres.length > 0) {
                const values = genres.map(genreId => [newBookId, genreId]);
                db.query('INSERT INTO books_genres (book_id, genre_id) VALUES ?', [values], (err, resultGenres) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error assigning genres to the book');
                    }
                    res.status(201).json({ id: newBookId, name, author, genres });
                });
            } else {
                res.status(201).json({ id: newBookId, name, author });
            }
        }
    });
};


exports.delete = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).send('L\'ID du livre est requis');
    }

    db.query('DELETE FROM books_genres WHERE book_id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error deleting data from database');
        }
    })

    db.query('DELETE FROM books WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error deleting data from database');
        } else if (results.affectedRows === 0) {
            res.status(404).send('Le livre n\'existe pas');
        } else {
            res.json({ message: 'Le livre a  t  supprim ' });
        }
    });
}

