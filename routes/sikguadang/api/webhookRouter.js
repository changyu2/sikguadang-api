const axios = require('axios');
const express = require('express');
const router = express.Router();

const Orders = require('../../../models/documents/sikguadang/ordersDocument');
const UsersDocument = require('../../../models/documents/sikguadang/usersDocument');
const iamportConst = require('../../../utils/iamportConst');

router.post('/complete', async (req, res) => {
  try {
    const { imp_uid, merchant_uid } = req.body;

    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: iamportConst.iamport.imp_key,
        imp_secret: iamportConst.iamport.imp_secret
      }
    });
    const { access_token } = getToken.data.response;

    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`,
      method: 'get',
      headers: { Authorization: access_token }
    });
    const paymentData = getPaymentData.data.response;

    const order = await Orders.findOne({
      merchant_uid: paymentData.merchant_uid
    });
    const amountToBePaid = order.totalPrice;

    const { amount, status, pay_method } = paymentData;
    if (amount === amountToBePaid) {
      await Orders.findOneAndUpdate(
        { merchant_uid: order.merchant_uid },
        { $set: { status: paymentData.status, edate: new Date() } }
      );

      switch (status) {
        case 'ready':
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          await UsersDocument.findOneAndUpdate(
            { email: order.email },
            { $set: { vbank_num, vbank_date, vbank_name } }
          );
          res.send({ status: 'vbankIssued', message: '가상계좌 발급 성공' });
          break;
        case 'paid':
          res.send({ status: 'success', message: '일반 결제 성공' });
          break;
      }
    } else {
      if (pay_method === 'vbank') {
        const deleteVbanks = await axios({
          url: `https://api.iamport.kr/vbanks/${imp_uid}`,
          method: 'delete',
          headers: { Authorization: access_token }
        });
        const deleteVbanksResult = deleteVbanks.data.response;
        await Orders.findOneAndUpdate(
          { merchant_uid: order.merchant_uid },
          { $set: { status: deleteVbanksResult.status, edate: new Date() } }
        );
        res.send({ status: 'forgery_vbank', message: '위조된 결제시도' });
      } else {
        const cancelPayments = await axios({
          url: 'https://api.iamport.kr/payments/cancel',
          method: 'post',
          headers: { Authorization: access_token },
          data: {
            imp_uid: imp_uid,
            reason: '위조 또는 변조된 결제시도로 인한 자동취소'
          }
        });
        const cancelPaymentsResult = cancelPayments.data.response;
        await Orders.findOneAndUpdate(
          { merchant_uid: order.merchant_uid },
          { $set: { status: cancelPaymentsResult.status, edate: new Date() } }
        );
        res.send({ status: 'forgery', message: '위조된 결제시도' });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
