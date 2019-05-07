const express = require('express');
const Promise = require('bluebird');
const moment = require('moment');

const preProcessingUtils = require('../../../utils/preProcessingUtils');
const ArticlesDocument = require('../../../models/documents/sikguadang/articlesDocument');
const FileMetasDocument = require('../../../models/documents/sikguadang/fileMetasDocument');

const router = express.Router();

/**
* @api {get} /v1/contents get content list
* @apiDescription API to fetch list of contents
* @apiGroup Contents
*
* @apiParam {query} limit=20 request limit.
* @apiParam {query} offset=0 request offset.
*
*  @apiExample {curl} Example usage:
*     curl -i http://localhost:5555/v1/contents
*
* @apiSuccessExample Success-Response:
*      HTTP/1.1 200 OK
*      [
*           {
*               "contentId":"5746ca9cd4c63ccd29ac9130",
*               "title":"test content",
*               "description":"first test content",
*               "thumbnailUrl":"t000/2016/05/26/t000_5746ca9cd4c63ccd29ac9130_1464257180427.png",
\*               "tags":[...]
*           },
*           ...
*      ]
*
*/

router.get('/', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getArticlesList)
    .then(function(data) {
      res.json(data.articleArray);
    })
    .catch(function(ex) {
      if (ex instanceof Error) {
        log.error(ex.message);
        log.error(ex.stack);
        res
          .status(responseCode.internalError.status)
          .json(responseCode.internalError.detail);
      } else {
        res.status(ex.status).json(ex.detail);
      }
    });
});
function getArticlesList(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    ArticlesDocument.find({
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        thumbnailUrl: 1,
        bannerUrl: 1,
        imageUrl: 1,
        hashTag: 1,
        source: 1,
        sourceLink: 1,
        category: 1,
        authorId: 1,
        sdate: 1
      })
      .exec(function(err, articleDocuments) {
        if (err) return reject(err);
        const articleArray = [];
        for (let i in articleDocuments) {
          const article = {};
          article.articleId = articleDocuments[i]._id;
          article.title = articleDocuments[i].title;
          article.thumbnailUrl = articleDocuments[i].thumbnailUrl;
          article.bannerUrl = articleDocuments[i].bannerUrl;
          article.imageUrl = articleDocuments[i].imageUrl;
          article.hashTag = articleDocuments[i].hashTag;
          article.source = articleDocuments[i].source;
          article.sourceLink = articleDocuments[i].sourceLink;
          article.category = articleDocuments[i].category;
          article.authorId = articleDocuments[i].authorId;
          article.sdate = articleDocuments[i].sdate;

          articleArray.push(article);
        }
        data.articleArray = articleArray;
        return resolve(data);
      });
  });
}

router.get('/1', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getArticlesList1)
    .then(function(data) {
      res.json(data.articleArray);
    })
    .catch(function(err) {
      if (err instanceof Error) {
        log.error(err.message);
        log.error(err.stack);
        res
          .status(responseCode.internalError.status)
          .json(responseCode.internalError.detail);
      } else {
        res.status(err.status).json(err.detail);
      }
    });
});
function getArticlesList1(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    ArticlesDocument.find({
      category: 1,
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        thumbnailUrl: 1,
        bannerUrl: 1,
        imageUrl: 1,
        hashTag: 1,
        source: 1,
        sourceLink: 1,
        category: 1,
        authorId: 1,
        sdate: 1
      })
      .exec(function(err, articleDocuments) {
        if (err) return reject(err);
        const articleArray = [];
        for (let i in articleDocuments) {
          const article = {};
          article.articleId = articleDocuments[i]._id;
          article.title = articleDocuments[i].title;
          article.thumbnailUrl = articleDocuments[i].thumbnailUrl;
          article.bannerUrl = articleDocuments[i].bannerUrl;
          article.imageUrl = articleDocuments[i].imageUrl;
          article.hashTag = articleDocuments[i].hashTag;
          article.source = articleDocuments[i].source;
          article.sourceLink = articleDocuments[i].sourceLink;
          article.category = articleDocuments[i].category;
          article.authorId = articleDocuments[i].authorId;
          article.sdate = articleDocuments[i].sdate;

          articleArray.push(article);
        }
        data.articleArray = articleArray;
        return resolve(data);
      });
  });
}

router.get('/2', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getArticlesList2)
    .then(function(data) {
      res.json(data.articleArray);
    })
    .catch(function(err) {
      if (err instanceof Error) {
        log.error(err.message);
        log.error(err.stack);
        res
          .status(responseCode.internalError.status)
          .json(responseCode.internalError.detail);
      } else {
        res.status(err.status).json(err.detail);
      }
    });
});
function getArticlesList2(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    ArticlesDocument.find({
      category: 2,
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        thumbnailUrl: 1,
        bannerUrl: 1,
        imageUrl: 1,
        hashTag: 1,
        source: 1,
        sourceLink: 1,
        category: 1,
        authorId: 1,
        sdate: 1
      })
      .exec(function(err, articleDocuments) {
        if (err) return reject(err);
        const articleArray = [];
        for (let i in articleDocuments) {
          const article = {};
          article.articleId = articleDocuments[i]._id;
          article.title = articleDocuments[i].title;
          article.thumbnailUrl = articleDocuments[i].thumbnailUrl;
          article.bannerUrl = articleDocuments[i].bannerUrl;
          article.imageUrl = articleDocuments[i].imageUrl;
          article.hashTag = articleDocuments[i].hashTag;
          article.source = articleDocuments[i].source;
          article.sourceLink = articleDocuments[i].sourceLink;
          article.category = articleDocuments[i].category;
          article.authorId = articleDocuments[i].authorId;
          article.sdate = articleDocuments[i].sdate;

          articleArray.push(article);
        }
        data.articleArray = articleArray;
        return resolve(data);
      });
  });
}

router.get('/3', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getArticlesList3)
    .then(function(data) {
      res.json(data.articleArray);
    })
    .catch(function(err) {
      if (err instanceof Error) {
        log.error(err.message);
        log.error(err.stack);
        res
          .status(responseCode.internalError.status)
          .json(responseCode.internalError.detail);
      } else {
        res.status(err.status).json(err.detail);
      }
    });
});
function getArticlesList3(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    ArticlesDocument.find({
      category: 3,
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        thumbnailUrl: 1,
        bannerUrl: 1,
        imageUrl: 1,
        hashTag: 1,
        source: 1,
        sourceLink: 1,
        category: 1,
        authorId: 1,
        sdate: 1
      })
      .exec(function(err, articleDocuments) {
        if (err) return reject(err);
        const articleArray = [];
        for (let i in articleDocuments) {
          const article = {};
          article.articleId = articleDocuments[i]._id;
          article.title = articleDocuments[i].title;
          article.thumbnailUrl = articleDocuments[i].thumbnailUrl;
          article.bannerUrl = articleDocuments[i].bannerUrl;
          article.imageUrl = articleDocuments[i].imageUrl;
          article.hashTag = articleDocuments[i].hashTag;
          article.source = articleDocuments[i].source;
          article.sourceLink = articleDocuments[i].sourceLink;
          article.category = articleDocuments[i].category;
          article.authorId = articleDocuments[i].authorId;
          article.sdate = articleDocuments[i].sdate;

          articleArray.push(article);
        }
        data.articleArray = articleArray;
        return resolve(data);
      });
  });
}

router.get('/:articleId', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getArticleById)
    .then(function(data) {
      if (
        data.article.status === apiConst.status.active &&
        moment(data.article.sdate) <= Date.now
      ) {
        // increaseViewCount(data);
        // /data.content.viewCount++;
      }
      res.json(data.article);
    })
    .catch(function(err) {
      if (err instanceof Error) {
        log.error(err.message);
        log.error(err.stack);
        res
          .status(responseCode.internalError.status)
          .json(responseCode.internalError.detail);
      } else {
        res.status(err.status).json(err.detail);
      }
    });
});
function getArticleById(data) {
  return new Promise(function(resolve, reject) {
    const articleId = data.params.articleId;
    ArticlesDocument.findById(articleId).exec(function(err, articleDocument) {
      const article = {};

      article.articleId = articleDocument._id;
      article.title = articleDocument.title;
      article.thumbnailUrl = articleDocument.thumbnailUrl;
      article.bannerUrl = articleDocument.bannerUrl;
      article.imageUrl = articleDocument.imageUrl;
      article.hashTag = articleDocument.hashTag;
      article.source = articleDocument.source;
      article.sourceLink = articleDocument.sourceLink;
      article.category = articleDocument.category;
      article.authorId = articleDocument.authorId;
      article.sdate = articleDocument.sdate;

      data.article = article;
      return resolve(data);
    });
  });
}

module.exports = router;
