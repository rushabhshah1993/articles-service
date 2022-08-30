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
    '/v1/search',
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

// @route GET /articles/search
// @description Fetch all articles by query (Paginated)
// @access Public
router.get(
    '/search',
    async (req, res) => {
        let query = req.query;
        let queryObj = {};

        if(Object.keys(query).length) {
            let keys = Object.keys(query);

            queryObj = createQueryObj(keys, query);
        };

        let totalArticles = await Article.find().then(results => results.length);

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;

        let totalArticlesActual = await Article.find(queryObj).then(results => results.length);

        Article.find(queryObj)
        .sort({created_at: -1})
        .limit(limit)
        .skip(skipIndex)
        .then(articles => {
            if(articles.length === 0) throw new Error;
            else {
                let has_next = false;
                if(articles.length < limit) has_next = false;
                else if(articles.length === limit && articles.length <= totalArticles - skipIndex) has_next = true;

                res.json({
                    results: articles,
                    pagination: {
                        page: page,
                        limit: limit,
                        total: totalArticlesActual,
                        count: articles.length,
                        has_next: has_next,
                        has_previous: skipIndex > 0
                    }
                });
            }
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
    '/v1/sort',
    (req, res) => {
        Article.find()
        .sort({
            "created_at": req.query.order === 'asc' ? 1 : -1
        })
        .then(articles => res.json(articles))
        .catch(err => res.status(404).json({error: 'No articles found'}));
    }
);

// @route GET /articles/sort
// @description Sort all articles (Paginated)
// @access Public
router.get(
    '/sort',
    async (req, res) => {
        let query = req.query;
        let queryObj = {};

        if(Object.keys(query).length) {
            let keys = Object.keys(query);

            queryObj = createQueryObj(keys, query);
        };

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;

        let totalArticles = await Article.find().then(results => results.length);

        Article.find(queryObj)
        .sort({
            "created_at": req.query.order === 'asc' ? 1 : -1
        })
        .limit(limit)
        .skip(skipIndex)
        .then(articles => {
            let has_next = false;
            if(articles.length < limit) has_next = false;
            else if(articles.length === limit && articles.length <= totalArticles - skipIndex) has_next = true;

            res.json({
                results: articles,
                pagination: {
                    page: page,
                    limit: limit,
                    total: totalArticles,
                    count: articles.length,
                    has_next: has_next,
                    has_previous: skipIndex > 0
                }
            })
        })
        .catch(err => res.status(404).json({error: 'No articles found'}));
    }
);

// @route GET /articles
// @description Fetch all articles
// @access Public
router.get(
    '/',
    paginatedResults(),
    (req, res) => {
        Article.find()
        .sort({created_at: -1})
        .then(() => {
            return res.json(res.paginatedResults);
        })
        .catch(err => {
            res.status(404).json({error: 'No articles found'})
        });
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
    let singularKeys = ['country', 'city', 'tags', 'competition', 'from', 'to', 'has_video', 'fighters'];
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
        } else if(key === 'tags' || key === 'competition' || key === 'fighters') {
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
        } else if(key === 'has_video') {
            queryObj[key] = query[key] == 'true';
        }
    }

    return queryObj;
}

function paginatedResults() {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        const results = {};

        try {
            let totalArticles = await Article.find().then(res => res.length);
            results.results = await Article.find()
                .sort({_id: 1})
                .limit(limit)
                .skip(skipIndex)
                .exec();

            let has_next = false;
            if(results.results.length < limit) has_next = false;
            else if(results.results.length === limit && results.results.length <= totalArticles - skipIndex) has_next = true;

            res.paginatedResults = results;
            res.paginatedResults['pagination'] = {
                limit: limit,
                page: page,
                count: results.results.length,
                total: totalArticles,
                has_next: has_next,
                has_previous: skipIndex > 0
            }
            next();
        } catch(e) {
            res.status(500).json({message: 'Error occured'});
        }
    }
}

module.exports = router;
