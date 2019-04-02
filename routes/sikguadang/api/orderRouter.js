const express = require('express');
const Promise = require('bluebird');
const router = express.Router();

const Orders = require('../../../models/documents/sikguadang/ordersDocument');
const preProcessingUtils = require('../../../utils/preProcessingUtils');
const authUtils = require('../../../utils/authUtils');

router.get('/', function(req, res, next) {
  preProcessingUtils
    .initData(req, true)
    .then(authUtils.getUserIdByToken)
    .then(getOrderList)
    .then(function(data) {
      res.json(data.orderArray);
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
function getOrderList(data) {
  return new Promise(function(resolve, reject) {
    const userId = data.userId;
    Orders.find({ userId: userId })
      .sort('-cdate')
      .exec(function(err, orders) {
        if (err) return reject(err);
        const orderArray = [];
        for (let i in orders) {
          const order = {
            orderId: '',
            userName: '',
            postcode: '',
            address: '',
            addressDetail: '',
            recipientName: '',
            recipientPhoneNumber: '',
            productName: '',
            productImage: '',
            optionItemName: '',
            optionItemPrice: '',
            price: '',
            discountPrice: '',
            totalPrice: '',
            productQty: '',
            deliveryDate: '',
            purchaseMethod: '',
            imp_uid: '',
            merchant_uid: '',
            status: '',
            cdate: ''
          };
          order.orderId = orders[i]._id;
          order.userName = orders[i].userName;
          order.postcode = orders[i].postcode;
          order.address = orders[i].address;
          order.addressDetail = orders[i].addressDetail;
          order.recipientName = orders[i].recipientName;
          order.recipientPhoneNumber = orders[i].recipientPhoneNumber;
          order.productName = orders[i].productName;
          order.productImage = orders[i].productImage;
          order.optionItemName = orders[i].optionItemName;
          order.optionItemPrice = orders[i].optionItemPrice;
          order.price = orders[i].price;
          order.discountPrice = orders[i].discountPrice;
          order.totalPrice = orders[i].totalPrice;
          order.productQty = orders[i].productQty;
          order.deliveryDate = orders[i].deliveryDate;
          order.purchaseMethod = orders[i].purchaseMethod;
          order.imp_uid = orders[i].imp_uid;
          order.merchant_uid = orders[i].merchant_uid;
          order.status = orders[i].status;
          order.cdate = orders[i].cdate;

          orderArray.push(order);
        }
        data.orderArray = orderArray;
        return resolve(data);
      });
  });
}

router.post('/', function(req, res, next) {
  preProcessingUtils
    .initData(req, true)
    .then(saveOrderInfo)
    .then(function(data) {
      res.json(data.order);
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
function saveOrderInfo(data) {
  return new Promise(function(resolve, reject) {
    const orders = new Orders();
    const order = data.body.order;
    orders.userId = order.userId;
    orders.userName = order.userName;
    orders.postcode = order.postcode;
    orders.address = order.address;
    orders.addressDetail = order.addressDetail;
    orders.recipientName = order.recipientName;
    orders.recipientPhoneNumber = order.recipientPhoneNumber;
    orders.productName = order.productName;
    orders.productImage = order.productImage;
    orders.optionItemName = order.optionItemName;
    orders.optionItemPrice = order.optionItemPrice;
    orders.price = order.price;
    orders.discountPrice = order.discountPrice;
    orders.totalPrice = order.totalPrice;
    orders.productQty = order.productQty;
    orders.deliveryDate = order.deliveryDate;
    orders.purchaseMethod = order.purchaseMethod;
    orders.merchant_uid = `merchant_${new Date().getTime()}`;
    orders.cdate = new Date();
    orders.edate = new Date();

    orders.save(function(err, result) {
      if (err) return reject(err);
      data.order = result;
      return resolve(data);
    });
  });
}

router.put('/:merchant_uid', function(req, res, next) {
  preProcessingUtils
    .initData(req, true)
    .then(updateOrderInfo)
    .then(function(data) {
      res.json(data);
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
function updateOrderInfo(data) {
  return new Promise(function(resolve, reject) {
    const order = data.body.order;
    const merchant_uid = data.params.merchant_uid;
    Orders.findOne({ merchant_uid: merchant_uid }).exec(function(err, orders) {
      if (err) return reject(err);
      if (!orders) return reject(responseCode.resourceNotFound);
      orders.status = order.status ? order.status : '';
      orders.edate = new Date();

      orders.save(function(err, result) {
        if (err) return reject(err);
        data.order = result;
        return resolve(data);
      });
    });
  });
}

module.exports = router;
