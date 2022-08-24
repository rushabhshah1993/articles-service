'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const ArticlesRoutes = require('./routes/api/articles');

const app = express();

app.use(helmet);

connectDB();

app.use(bodyParser.json());
app.use('/articles', ArticlesRoutes);

app.get('/', (req, res) => {
    res.send('Hello world!');
});

const port = process.env.port || 8082;

app.listen(
    port,
    () => {
        console.log(`Server running on port ${port}`);
    }
);
