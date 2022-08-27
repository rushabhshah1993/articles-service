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
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

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
