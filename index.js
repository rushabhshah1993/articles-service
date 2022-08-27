'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const ArticlesRoutes = require('./routes/api/articles');

const app = express();

app.use(helmet());
app.use(cors({
    origin: ['http://localhost', 'https://leagues-947c5.web.app']
}))

connectDB();

app.use(bodyParser.json());
app.use('/articles', ArticlesRoutes);

app.get('/', (req, res) => {
    res.send('Hello world!');
});

const port = process.env.PORT || 8082;

app.listen(
    port,
    () => {
        console.log(`Server running on port ${port}`);
    }
);
