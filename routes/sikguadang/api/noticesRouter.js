const express = require('express');
const Promise = require('bluebird');
const moment = require('moment');

const preProcessingUtils = require('../../../utils/preProcessingUtils');
const NoticesDocument = require('../../../models/documents/sikguadang/noticesDocument');
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
    .then(getNoticesList)
    .then(function(data) {
      res.json(data.noticeArray);
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
function getNoticesList(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    NoticesDocument.find({
      status: apiConst.status.active,
      sdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-sdate')
      .select({
        title: 1,
        text: 1,
        imageCards: 1,
        authorId: 1,
        sdate: 1
      })
      .exec(function(err, noticeDocuments) {
        if (err) return reject(err);
        const noticeArray = [];
        for (let i in noticeDocuments) {
          const notice = {};
          notice.noticeId = noticeDocuments[i]._id;
          notice.title = noticeDocuments[i].title;
          notice.text = noticeDocuments[i].text;
          notice.imageCards = noticeDocuments[i].imageCards;
          notice.authorId = noticeDocuments[i].authorId;
          notice.sdate = noticeDocuments[i].sdate;

          noticeArray.push(notice);
        }
        data.noticeArray = noticeArray;
        return resolve(data);
      });
  });
}

router.get('/:noticeId', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getNoticeById)
    .then(function(data) {
      if (
        data.notice.status === apiConst.status.active &&
        moment(data.notice.sdate) <= Date.now
      ) {
        // increaseViewCount(data);
        // /data.content.viewCount++;
      }
      res.json(data.notice);
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
function getNoticeById(data) {
  return new Promise(function(resolve, reject) {
    const noticeId = data.params.noticeId;
    NoticesDocument.findById(noticeId).exec(function(err, noticeDocument) {
      const notice = {};

      notice.noticeId = noticeDocument._id;
      notice.title = noticeDocument.title;
      notice.text = noticeDocument.text;
      notice.imageCards = noticeDocument.imageCards;
      notice.authorId = noticeDocument.authorId;
      notice.sdate = noticeDocument.sdate;

      data.notice = notice;
      return resolve(data);
    });
  });
}

module.exports = router;
