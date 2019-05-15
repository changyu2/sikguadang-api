const express = require('express');
const Promise = require('bluebird');
const moment = require('moment');

const preProcessingUtils = require('../../../utils/preProcessingUtils');
const StoreItemDocument = require('../../../models/documents/sikguadang/storeItemDocument');
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
    .then(getStoreItemList)
    .then(function(data) {
      res.json(data.storeItemArray);
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
function getStoreItemList(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    StoreItemDocument.find({
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        description: 1,
        thumbnailUrl: 1,
        price: 1,
        discountPrice: 1,
        weight: 1,
        expirationDate: 1,
        category: 1,
        soldOut: 1,
        limited: 1,
        hot: 1,
        new: 1,
        authorId: 1,
        sdate: 1,
        productDetailCards: 1,
        productInfoCards: 1
      })
      .exec(function(err, storeItemDocuments) {
        if (err) return reject(err);
        const storeItemArray = [];
        for (let i in storeItemDocuments) {
          const storeItem = {};
          storeItem.storeItemId = storeItemDocuments[i]._id;
          storeItem.title = storeItemDocuments[i].title;
          storeItem.description = storeItemDocuments[i].description;
          storeItem.thumbnailUrl = storeItemDocuments[i].thumbnailUrl;
          storeItem.price = storeItemDocuments[i].price;
          storeItem.discountPrice = storeItemDocuments[i].discountPrice;
          storeItem.optionItem1Name = storeItemDocuments[i].optionItem1Name;
          storeItem.optionItem1Price = storeItemDocuments[i].optionItem1Price;
          storeItem.optionItem2Name = storeItemDocuments[i].optionItem2Name;
          storeItem.optionItem2Price = storeItemDocuments[i].optionItem2Price;
          storeItem.optionItem3Name = storeItemDocuments[i].optionItem3Name;
          storeItem.optionItem3Price = storeItemDocuments[i].optionItem3Price;
          storeItem.optionItem4Name = storeItemDocuments[i].optionItem4Name;
          storeItem.optionItem4Price = storeItemDocuments[i].optionItem4Price;
          storeItem.weight = storeItemDocuments[i].weight;
          storeItem.expirationDate = storeItemDocuments[i].expirationDate;
          storeItem.category = storeItemDocuments[i].category;
          storeItem.soldOut = storeItemDocuments[i].soldOut;
          storeItem.limited = storeItemDocuments[i].limited;
          storeItem.hot = storeItemDocuments[i].hot;
          storeItem.new = storeItemDocuments[i].new;
          storeItem.authorId = storeItemDocuments[i].authorId;
          storeItem.sdate = storeItemDocuments[i].sdate;
          storeItem.productDetailCards =
            storeItemDocuments[i].productDetailCards;
          storeItem.productInfoCards = storeItemDocuments[i].productInfoCards;

          storeItemArray.push(storeItem);
        }
        data.storeItemArray = storeItemArray;
        return resolve(data);
      });
  });
}

router.get('/1', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getStoreItem1)
    .then(function(data) {
      res.json(data.storeItemArray);
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
function getStoreItem1(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    StoreItemDocument.find({
      category: 1,
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        description: 1,
        thumbnailUrl: 1,
        price: 1,
        discountPrice: 1,
        weight: 1,
        expirationDate: 1,
        category: 1,
        soldOut: 1,
        limited: 1,
        hot: 1,
        new: 1,
        authorId: 1,
        sdate: 1,
        productDetailCards: 1,
        productInfoCards: 1
      })
      .exec(function(err, storeItemDocuments) {
        if (err) return reject(err);
        const storeItemArray = [];
        for (let i in storeItemDocuments) {
          const storeItem = {};
          storeItem.storeItemId = storeItemDocuments[i]._id;
          storeItem.title = storeItemDocuments[i].title;
          storeItem.description = storeItemDocuments[i].description;
          storeItem.thumbnailUrl = storeItemDocuments[i].thumbnailUrl;
          storeItem.price = storeItemDocuments[i].price;
          storeItem.discountPrice = storeItemDocuments[i].discountPrice;
          storeItem.optionItem1Name = storeItemDocuments[i].optionItem1Name;
          storeItem.optionItem1Price = storeItemDocuments[i].optionItem1Price;
          storeItem.optionItem2Name = storeItemDocuments[i].optionItem2Name;
          storeItem.optionItem2Price = storeItemDocuments[i].optionItem2Price;
          storeItem.optionItem3Name = storeItemDocuments[i].optionItem3Name;
          storeItem.optionItem3Price = storeItemDocuments[i].optionItem3Price;
          storeItem.optionItem4Name = storeItemDocuments[i].optionItem4Name;
          storeItem.optionItem4Price = storeItemDocuments[i].optionItem4Price;
          storeItem.category = storeItemDocuments[i].category;
          storeItem.weight = storeItemDocuments[i].weight;
          storeItem.expirationDate = storeItemDocuments[i].expirationDate;
          storeItem.soldOut = storeItemDocuments[i].soldOut;
          storeItem.limited = storeItemDocuments[i].limited;
          storeItem.hot = storeItemDocuments[i].hot;
          storeItem.new = storeItemDocuments[i].new;
          storeItem.authorId = storeItemDocuments[i].authorId;
          storeItem.sdate = storeItemDocuments[i].sdate;
          storeItem.productDetailCards =
            storeItemDocuments[i].productDetailCards;
          storeItem.productInfoCards = storeItemDocuments[i].productInfoCards;

          storeItemArray.push(storeItem);
        }
        data.storeItemArray = storeItemArray;
        return resolve(data);
      });
  });
}

router.get('/2', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getStoreItem2)
    .then(function(data) {
      res.json(data.storeItemArray);
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
function getStoreItem2(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    StoreItemDocument.find({
      category: 2,
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        description: 1,
        thumbnailUrl: 1,
        price: 1,
        discountPrice: 1,
        weight: 1,
        expirationDate: 1,
        category: 1,
        soldOut: 1,
        limited: 1,
        hot: 1,
        new: 1,
        authorId: 1,
        sdate: 1,
        productDetailCards: 1,
        productInfoCards: 1
      })
      .exec(function(err, storeItemDocuments) {
        if (err) return reject(err);
        const storeItemArray = [];
        for (let i in storeItemDocuments) {
          const storeItem = {};
          storeItem.storeItemId = storeItemDocuments[i]._id;
          storeItem.title = storeItemDocuments[i].title;
          storeItem.description = storeItemDocuments[i].description;
          storeItem.thumbnailUrl = storeItemDocuments[i].thumbnailUrl;
          storeItem.price = storeItemDocuments[i].price;
          storeItem.discountPrice = storeItemDocuments[i].discountPrice;
          storeItem.optionItem1Name = storeItemDocuments[i].optionItem1Name;
          storeItem.optionItem1Price = storeItemDocuments[i].optionItem1Price;
          storeItem.optionItem2Name = storeItemDocuments[i].optionItem2Name;
          storeItem.optionItem2Price = storeItemDocuments[i].optionItem2Price;
          storeItem.optionItem3Name = storeItemDocuments[i].optionItem3Name;
          storeItem.optionItem3Price = storeItemDocuments[i].optionItem3Price;
          storeItem.optionItem4Name = storeItemDocuments[i].optionItem4Name;
          storeItem.optionItem4Price = storeItemDocuments[i].optionItem4Price;
          storeItem.weight = storeItemDocuments[i].weight;
          storeItem.expirationDate = storeItemDocuments[i].expirationDate;
          storeItem.category = storeItemDocuments[i].category;
          storeItem.soldOut = storeItemDocuments[i].soldOut;
          storeItem.limited = storeItemDocuments[i].limited;
          storeItem.hot = storeItemDocuments[i].hot;
          storeItem.new = storeItemDocuments[i].new;
          storeItem.authorId = storeItemDocuments[i].authorId;
          storeItem.sdate = storeItemDocuments[i].sdate;
          storeItem.productDetailCards =
            storeItemDocuments[i].productDetailCards;
          storeItem.productInfoCards = storeItemDocuments[i].productInfoCards;

          storeItemArray.push(storeItem);
        }
        data.storeItemArray = storeItemArray;
        return resolve(data);
      });
  });
}

router.get('/3', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getStoreItem3)
    .then(function(data) {
      res.json(data.storeItemArray);
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
function getStoreItem3(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    StoreItemDocument.find({
      category: 3,
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        description: 1,
        thumbnailUrl: 1,
        price: 1,
        discountPrice: 1,
        weight: 1,
        expirationDate: 1,
        category: 1,
        soldOut: 1,
        limited: 1,
        hot: 1,
        new: 1,
        authorId: 1,
        sdate: 1,
        productDetailCards: 1,
        productInfoCards: 1
      })
      .exec(function(err, storeItemDocuments) {
        if (err) return reject(err);
        const storeItemArray = [];
        for (let i in storeItemDocuments) {
          const storeItem = {};
          storeItem.storeItemId = storeItemDocuments[i]._id;
          storeItem.title = storeItemDocuments[i].title;
          storeItem.description = storeItemDocuments[i].description;
          storeItem.thumbnailUrl = storeItemDocuments[i].thumbnailUrl;
          storeItem.price = storeItemDocuments[i].price;
          storeItem.discountPrice = storeItemDocuments[i].discountPrice;
          storeItem.optionItem1Name = storeItemDocuments[i].optionItem1Name;
          storeItem.optionItem1Price = storeItemDocuments[i].optionItem1Price;
          storeItem.optionItem2Name = storeItemDocuments[i].optionItem2Name;
          storeItem.optionItem2Price = storeItemDocuments[i].optionItem2Price;
          storeItem.optionItem3Name = storeItemDocuments[i].optionItem3Name;
          storeItem.optionItem3Price = storeItemDocuments[i].optionItem3Price;
          storeItem.optionItem4Name = storeItemDocuments[i].optionItem4Name;
          storeItem.optionItem4Price = storeItemDocuments[i].optionItem4Price;
          storeItem.weight = storeItemDocuments[i].weight;
          storeItem.expirationDate = storeItemDocuments[i].expirationDate;
          storeItem.category = storeItemDocuments[i].category;
          storeItem.soldOut = storeItemDocuments[i].soldOut;
          storeItem.limited = storeItemDocuments[i].limited;
          storeItem.hot = storeItemDocuments[i].hot;
          storeItem.new = storeItemDocuments[i].new;
          storeItem.authorId = storeItemDocuments[i].authorId;
          storeItem.sdate = storeItemDocuments[i].sdate;
          storeItem.productDetailCards =
            storeItemDocuments[i].productDetailCards;
          storeItem.productInfoCards = storeItemDocuments[i].productInfoCards;

          storeItemArray.push(storeItem);
        }
        data.storeItemArray = storeItemArray;
        return resolve(data);
      });
  });
}

router.get('/:storeItemId', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getStoreItemById)
    .then(function(data) {
      if (
        data.storeItem.status === apiConst.status.active &&
        moment(data.storeItem.sdate) <= Date.now
      ) {
        // increaseViewCount(data);
        // /data.content.viewCount++;
      }
      res.json(data.storeItem);
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
function getStoreItemById(data) {
  return new Promise(function(resolve, reject) {
    const storeItemId = data.params.storeItemId;
    StoreItemDocument.findById(storeItemId).exec(function(
      err,
      storeItemDocument
    ) {
      const storeItem = {};

      storeItem.storeItemId = storeItemDocument._id;
      storeItem.title = storeItemDocument.title;
      storeItem.description = storeItemDocument.description;
      storeItem.thumbnailUrl = storeItemDocument.thumbnailUrl;
      storeItem.price = storeItemDocument.price;
      storeItem.discountPrice = storeItemDocument.discountPrice;
      storeItem.optionItem1Name = storeItemDocument.optionItem1Name;
      storeItem.optionItem1Price = storeItemDocument.optionItem1Price;
      storeItem.optionItem2Name = storeItemDocument.optionItem2Name;
      storeItem.optionItem2Price = storeItemDocument.optionItem2Price;
      storeItem.optionItem3Name = storeItemDocument.optionItem3Name;
      storeItem.optionItem3Price = storeItemDocument.optionItem3Price;
      storeItem.optionItem4Name = storeItemDocument.optionItem4Name;
      storeItem.optionItem4Price = storeItemDocument.optionItem4Price;
      storeItem.weight = storeItemDocument.weight;
      storeItem.expirationDate = storeItemDocument.expirationDate;
      storeItem.category = storeItemDocument.category;
      storeItem.soldOut = storeItemDocument.soldOut;
      storeItem.limited = storeItemDocument.limited;
      storeItem.hot = storeItemDocument.hot;
      storeItem.new = storeItemDocument.new;
      storeItem.authorId = storeItemDocument.authorId;
      storeItem.sdate = storeItemDocument.sdate;
      storeItem.productDetailCards = storeItemDocument.productDetailCards;
      storeItem.productInfoCards = storeItemDocument.productInfoCards;

      data.storeItem = storeItem;
      return resolve(data);
    });
  });
}

module.exports = router;
