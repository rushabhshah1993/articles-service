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
        images: {
            type: Array
        },
        videos: {
            type: Array
        }
    },
    thumbnail: {
        type: String
    },
    tags: {
        type: Array,
        required: true
    },
    competition: {
        type: Array,
        default: ['IFC']
    },
    fighter: {
        type: String
    },
    location: {
        country: {
            type: String,
            default: 'India'
        },
        city: {
            type: String,
            default: 'Mumbai'
        }
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('article', ArticleSchema);
