const router = require('express').Router();

const BooksController = require('../Controller/books.controller');


// Find Books
router.get('/books', BooksController.findAll);

// Create Book
router.post('/books', BooksController.create);

router.delete('/books/:id', BooksController.delete);


module.exports = router;
