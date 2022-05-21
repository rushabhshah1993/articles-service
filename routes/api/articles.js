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

// @route GET /articles/search
// @description Fetch all articles by query
// @access Public
router.get(
    '/search',
    (req, res) => {
        let query = req.query;
        let queryObj = {};

        if(Object.keys(query).length) {
            let keys = Object.keys(query);

            queryObj = createQueryObj(keys, query);
        };

        Article.find(queryObj)
        .then(articles => {
            if(articles.length === 0) throw new Error;
            res.json(articles);
        })
        .catch(err => res.status(404).json({
            error: 'No articles found with the following query', 
            query: req.query
        }));
    }
);

// @route GET /articles/sort
// @description Sort all articles
// @access Public
router.get(
    '/sort',
    (req, res) => {
        Article.find()
        .sort({
            "created_at": req.query.order === 'asc' ? 1 : -1
        })
        .then(articles => res.json(articles))
        .catch(err => res.status(404).json({error: 'No articles found'}));
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
        .catch(err => res.status(404).json({error: 'No articles found'}));
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
        .catch(err => res.status(404).json({error: `No article found`}));
    }
);

// @route POST /articles
// @description Create a new article
// @access Public
router.post(
    '/',
    (req, res) => {
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

function createQueryObj(keys, query) {
    let queryObj = {};
    let singularKeys = ['country', 'city', 'tags', 'competition', 'from', 'to'];
    for(let key of keys) {
        if(!singularKeys.includes(key)) {
            queryObj[key] = {
                "$regex": query[key],
                "$options": "i"
            }
        } else if(key === 'country' || key === 'city') {
            queryObj[`location.${key}`] = {
                "$regex": query[key],
                "$options": "i"
            }
        } else if(key === 'tags' || key === 'competition') {
            queryObj[key] = {
                $in: query[key].split(',').map(ele => ele.trim())
            }
        } else if(key === 'from') {
            queryObj['created_at'] = {
                $gte: new Date(+query[key])
            };
            if(keys.includes('to')) {
                queryObj.created_at["$lte"] = new Date(+query['to'])
            }
        }
    }

    return queryObj;
}

module.exports = router;
