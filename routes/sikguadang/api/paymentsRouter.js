const axios = require('axios');
const moment = require('moment');
const express = require('express');
const router = express.Router();

const Orders = require('../../../models/documents/sikguadang/ordersDocument');
const UsersDocument = require('../../../models/documents/sikguadang/usersDocument');
const iamportConst = require('../../../utils/iamportConst');

router.post('/complete', async (req, res) => {
  try {
    const { imp_uid, merchant_uid } = req.body;

    // 액세스 토큰(access token) 발급 받기
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: iamportConst.iamport.imp_key, // REST API키
        imp_secret: iamportConst.iamport.imp_secret // REST API Secret
      }
    });
    const { access_token } = getToken.data.response; // 인증 토큰

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: 'get', // GET method
      headers: { Authorization: access_token } // 인증 토큰 Authorization header에 추가
    });
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보

    // DB에서 결제되어야 하는 금액 조회
    const order = await Orders.findOne({
      merchant_uid: paymentData.merchant_uid
    });
    const amountToBePaid = order.totalPrice; // 결제되어야 하는 금액

    // 결제 검증하기
    const { amount, status, pay_method } = paymentData;
    // console.log(paymentData);
    if (amount === amountToBePaid) {
      // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      await Orders.findOneAndUpdate(
        { merchant_uid: order.merchant_uid },
        { $set: { status: paymentData.status, imp_uid: imp_uid } }
      ); // DB에 결제 정보 저장

      switch (status) {
        case 'ready': // 가상계좌 발급
          // DB에 가상계좌 발급 정보 저장
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          console.log(paymentData);
          await UsersDocument.findOneAndUpdate(
            { email: order.email },
            { $set: { vbank_num, vbank_date, vbank_name } }
          );
          // 가상계좌 발급 안내 문자메시지 발송
          // SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}` });
          res.send({
            vbank_num,
            vbank_date: moment(vbank_date * 1000).format('YYYY-MM-DD'),
            vbank_name,
            status: 'vbankIssued',
            message: '가상계좌 발급 성공'
          });
          break;
        case 'paid': // 결제 완료
          res.send({ status: 'success', message: '일반 결제 성공' });
          break;
      }
    } else {
      // 결제 금액 불일치. 위/변조 된 결제
      if (pay_method === 'vbank') {
        // 결제수단이 가상계좌인 경우, 발급된 가상계좌 삭제 (입금시도 방지)
        const deleteVbanks = await axios({
          url: `https://api.iamport.kr/vbanks/${imp_uid}`,
          method: 'delete',
          headers: { Authorization: access_token }
        });
        const deleteVbanksResult = deleteVbanks.data.response;
        // console.log(deleteVbanksResult)
        await Orders.findOneAndUpdate(
          { merchant_uid: order.merchant_uid },
          { $set: { status: deleteVbanksResult.status } }
        );
        res.send({ status: 'forgery_vbank', message: '위조된 결제시도' });
      } else {
        // 가상계좌가 아닌 다른 결제수단인 경우, 결제된 금액 취소
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
        // console.log(cancelPaymentsResult);
        await Orders.findOneAndUpdate(
          { merchant_uid: order.merchant_uid },
          { $set: { status: cancelPaymentsResult.status } }
        );
        res.send({ status: 'forgery', message: '위조된 결제시도' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post('/cancel', async (req, res) => {
  try {
    const {
      imp_uid,
      merchant_uid,
      checkSum,
      refund_holder,
      refund_bank,
      refund_account
    } = req.body;
    console.log(imp_uid);
    console.log(merchant_uid);
    console.log(checkSum);
    console.log(refund_holder);
    console.log(refund_bank);
    console.log(refund_account);
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

    const cancelPayments = await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: { Authorization: access_token },
      data: {
        imp_uid: imp_uid,
        merchant_uid: merchant_uid,
        checksum: checkSum,
        reason: '결제 취소',
        refund_holder: refund_holder ? refund_holder : '',
        refund_bank: refund_bank ? refund_bank : '',
        refund_account: refund_account ? refund_account : ''
      }
    });
    console.log(cancelPayments.data);
    if (cancelPayments.data.response) {
      const cancelPaymentsResult = cancelPayments.data.response;
      await Orders.findOneAndUpdate(
        { merchant_uid: merchant_uid },
        { $set: { status: cancelPaymentsResult.status } }
      );
      res.send({ status: 'cancelSuccess', message: '결제가 취소되었습니다.' });
    } else {
      res.send({
        status: 'cancelFailed',
        message: cancelPayments.data.message
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
