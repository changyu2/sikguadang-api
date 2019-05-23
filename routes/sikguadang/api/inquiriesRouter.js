const express = require('express');
const Promise = require('bluebird');
const moment = require('moment');

const preProcessingUtils = require('../../../utils/preProcessingUtils');
const authUtils = require('../../../utils/authUtils');
const InquiriesDocument = require('../../../models/documents/sikguadang/inquiriesDocument');

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
    .then(getInquiriesList)
    .then(function(data) {
      res.json(data.inquiryArray);
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
function getInquiriesList(data) {
  return new Promise(function(resolve, reject) {
    const limit = util.isNullOrUndefined(data.query.limit)
      ? 20
      : parseInt(data.query.limit);
    const offset = util.isNullOrUndefined(data.query.offset)
      ? 0
      : parseInt(data.query.offset);
    InquiriesDocument.find({
      status: apiConst.status.active,
      cdate: { $lte: data.now }
    })
      .limit(limit)
      .skip(offset)
      .sort('-cdate')
      .select({
        title: 1,
        number: 1,
        text: 1,
        userName: 1,
        password: 1,
        userId: 1,
        answer: 1,
        cdate: 1
      })
      .exec(function(err, inquiryDocuments) {
        if (err) return reject(err);
        const inquiryArray = [];
        for (let i in inquiryDocuments) {
          const inquiry = {};
          inquiry.inquiryId = inquiryDocuments[i]._id;
          inquiry.number = inquiryDocuments[i].number;
          inquiry.title = inquiryDocuments[i].title;
          inquiry.text = inquiryDocuments[i].text;
          inquiry.userName = inquiryDocuments[i].userName;
          inquiry.answer = inquiryDocuments[i].answer;
          inquiry.cdate = inquiryDocuments[i].cdate;

          inquiryArray.push(inquiry);
        }
        data.inquiryArray = inquiryArray;
        return resolve(data);
      });
  });
}

router.get('/:inquiryId', function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getInquiryById)
    .then(function(data) {
      if (
        data.inquiry.status === apiConst.status.active &&
        moment(data.inquiry.sdate) <= Date.now
      ) {
        // increaseViewCount(data);
        // /data.content.viewCount++;
      }
      res.json(data.inquiry);
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
function getInquiryById(data) {
  return new Promise(function(resolve, reject) {
    const inquiryId = data.params.inquiryId;
    InquiriesDocument.findById(inquiryId).exec(function(err, inquiryDocument) {
      const inquiry = {};

      inquiry.inquiryId = inquiryDocument._id;
      inquiry.number = inquiryDocument.number;
      inquiry.title = inquiryDocument.title;
      inquiry.text = inquiryDocument.text;
      inquiry.password = inquiryDocument.password;
      inquiry.userName = inquiryDocument.userName;
      inquiry.userId = inquiryDocument.userId;
      inquiry.answer = inquiryDocument.answer;
      inquiry.sdate = inquiryDocument.sdate;

      data.inquiry = inquiry;
      return resolve(data);
    });
  });
}

router.post('/', function(req, res, next) {
  preProcessingUtils
    .initData(req, true)
    .then(authUtils.getUserIdByToken)
    .then(createInquiry)
    .then(assembleInquiryByDocument)
    .then(function(data) {
      res.json(data.inquiry);
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
function createInquiry(data) {
  return new Promise(function(resolve, reject) {
    const inquiry = data.body.inquiry;
    const inquiryDocument = new InquiriesDocument();
    inquiryDocument.title = inquiry.title ? inquiry.title : '';
    inquiryDocument.text = inquiry.text ? inquiry.text : '';
    inquiryDocument.userName = inquiry.userName ? inquiry.userName : '';
    inquiryDocument.password = inquiry.password ? inquiry.password : '';
    inquiryDocument.userId = data.userId;
    inquiryDocument.status = inquiry.status
      ? inquiry.status
      : apiConst.status.delete;
    inquiryDocument.sdate = inquiry.sdate ? moment(inquiry.sdate).utc() : null;
    inquiryDocument.cdate = new Date();
    inquiryDocument.edate = new Date();

    inquiryDocument.save(function(err, result) {
      if (err) return reject(err);
      data.inquiryDocument = result;
      return resolve(data);
    });
  });
}
function assembleInquiryByDocument(data) {
  return new Promise(function(resolve, reject) {
    const inquiry = {};
    inquiry.inquiryId = data.inquiryDocument._id;
    inquiry.title = data.inquiryDocument.title;
    inquiry.text = data.inquiryDocument.text;
    inquiry.userName = data.inquiryDocument.userName;
    inquiry.status = data.inquiryDocument.status;
    inquiry.sdate = data.inquiryDocument.sdate;
    inquiry.cdate = data.inquiryDocument.cdate;
    inquiry.edate = data.inquiryDocument.edate;
    inquiry.userId = data.inquiryDocument.userId;
    data.inquiry = inquiry;
    return resolve(data);
  });
}

router.put('/:inquiryId', function(req, res, next) {
  preProcessingUtils
    .initData(req, true)
    .then(authUtils.getUserIdByToken)
    .then(updateInquiry)
    .then(assembleInquiryByDocument)
    .then(function(data) {
      res.json(data.inquiry);
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
function updateInquiry(data) {
  return new Promise(function(resolve, reject) {
    const inquiryId = data.params.inquiryId;
    const inquiry = data.body.inquiry;
    InquiriesDocument.findById(inquiryId).exec(function(err, inquiryDocument) {
      if (err) return reject(err);
      if (!inquiryDocument) return reject(responseCode.resourceNotFound);
      inquiryDocument.title = inquiry.title ? inquiry.title : '';
      inquiryDocument.text = inquiry.text ? inquiry.text : '';
      inquiryDocument.userName = inquiry.userName ? inquiry.userName : '';
      inquiryDocument.password = inquiry.password ? inquiry.password : '';
      inquiryDocument.status = inquiry.status
        ? inquiry.status
        : apiConst.status.delete;
      inquiryDocument.sdate = inquiry.sdate
        ? moment(inquiry.sdate).utc()
        : null;
      inquiryDocument.edate = new Date();

      inquiryDocument.save(function(err, updateInquiryResult) {
        if (err) return reject(err);
        data.inquiryDocument = updateInquiryResult;
        return resolve(data);
      });
    });
  });
}

router.delete('/:inquiryTitle', function(req, res, next) {
  preProcessingUtils
    .initData(req, true)
    .then(authUtils.getUserIdByToken)
    .then(deleteInquiry)
    .then(function(data) {
      res.status(responseCode.success.status).json(responseCode.success.detail);
    })
    .catch(function(err) {
      if (err instanceof Error) {
        log.error(err.message);
        log.error(err.stack);
        res.json(err);
      } else {
        res.json(err);
      }
    });
});
function deleteInquiry(data) {
  return new Promise(function(resolve, reject) {
    const userId = data.userId;
    const inquiryTitle = data.params.inquiryTitle;

    InquiriesDocument.findOneAndDelete(
      { userId: userId, title: inquiryTitle },
      function(err, result) {
        if (err) return reject(err);
        data.result = result;
        return resolve(data);
      }
    );
  });
}

module.exports = router;
