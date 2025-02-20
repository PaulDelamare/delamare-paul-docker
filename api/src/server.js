// IMPORT
const express = require('express');
const helmet = require('helmet');
const { createRateLimiter } = require('./Middlewares/rateLimiter.middleware');
const compression = require('compression');

// IMPORT ROUTES
const booksRoutes = require('./Routes/book.routes');
const genresRoutes = require('./Routes/genre.routes');

// VARIABLE
const app = express();
const port = 3001

// Middlewares
app.use(helmet());
app.use(express.json());

app.use(compression(
    {
        threshold: 1024,
        filter: (req) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return !req.path.match(/\.(jpg|jpeg|png|gif|pdf|svg|mp4)$/i);
        }
    }
));

const limiter = createRateLimiter(15, 1000);
app.use(limiter);

// ROUTES
app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

app.use('/v1', booksRoutes);
app.use('/v1', genresRoutes);


// LANCEMENT DU SERVER
app.listen(port, () => {
    console.log(`🚀 Server running on port http://localhost:${port}`);
});