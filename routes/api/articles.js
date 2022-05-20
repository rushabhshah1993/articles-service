const express = require('express');
const router = express.Router();

const Article = require('./../../models/Article');

// @route GET /articles/test
// @description Testing articles route
// @access Public
router.get(
    '/test',
    (req, res) => {
        res.send('Articles route testing');
    }
);

// @route GET /articles
// @description Fetch all articles
// @access Public
router.get(
    '/',
    (req, res) => {
        Article.find()
        .then(articles => res.json(articles))
        .catch(err => res.status(404).json({noarticlesfound: 'No articles found'}));
    }
);

// @route GET /articles/:id
// @description Fetch single article by ID
// @access Public
router.get(
    '/:id',
    (req, res) => {
        Article.findById(req.params.id)
        .then(article => res.json(article))
        .catch(err => res.status(404).json({noarticlefound: 'No article found'}));
    }
);

// @route POST /articles
// @description Create a new article
// @access Public
router.post(
    '/',
    (req, res) => {
        console.log("body:   ", req.body);
        Article.create(req.body)
        .then(article => res.json({
            message: 'Article created successfully',
            article: article
        }))
        .catch(err => {
            console.log("err:  ", err);
            res.status(400).json({error: 'Unable to add this article'})
        });
    }
);

// @route PUT /articles/:id
// @description Edit/update an article
// @access Public
router.put(
    '/:id',
    (req, res) => {
        Article.findByIdAndUpdate(req.params.id, req.body)
        .then(article => res.json({
            message: 'Article updated successfully',
            article: article
        }))
        .catch(err => res.status(400).json({error: 'Unable to edit the article'}));
    }
);

// @route DELETE /articles/:id
// @description Delete an article
// @access Public
router.delete(
    '/:id',
    (req, res) => {
        Article.findByIdAndRemove(req.params.id, req.body)
        .then(() => res.json({
            message: 'Article deleted successfully'
        }))
        .catch(err => res.status(404).json({error: 'Article not found'}));
    }
);

module.exports = router;
