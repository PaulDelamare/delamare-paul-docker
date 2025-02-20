const router = require('express').Router();

const genresController = require('../Controller/genre.controller');


// Find Books
router.get('/genres', genresController.findAll);


module.exports = router;
