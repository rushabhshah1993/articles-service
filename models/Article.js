'use strict';

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    content: {
        type: String
    },
    author: {
        type: String
    },
    publication: {
        type: String,
        required: true
    },
    media: {
        type: Array
    },
    thumbnail: {
        type: String
    },
    tags: {
        type: Array,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('article', ArticleSchema);
