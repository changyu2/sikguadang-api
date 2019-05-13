const moment = require('moment');
const emailReg = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9\.])+$/;
const idReg = /^[A-za-z0-9]{4,16}$/g;

exports.idValidate = function(id) {
  if (!id) return false;

  if (id.length > 16 && id.length < 4) return false;

  const reg = new RegExp(idReg);
  const valid = reg.test(id);
  if (!valid) {
    return false;
  }

  return true;
};

exports.emailValidate = function(email) {
  if (!email) return false;

  if (email.length > 254) return false;
  const reg = new RegExp(emailReg);
  const valid = reg.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  const parts = email.split('@');
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split('.');
  if (
    domainParts.some(function(part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

//pasword validating
exports.passwordValidate = function(password) {
  if (!password) return false; //No Input
  if (password.search(/\s/) != -1) return false; //There must be no blank
  if (password.length < 10) return false;

  let chk = 0;
  if (password.search(/[0-9]/g) != -1) chk++;
  if (password.search(/[a-z]/gi) != -1) chk++;
  if (password.search(/[A-Z]/gi) != -1) chk++;
  if (password.search(/\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"/g) != -1)
    chk++;
  if (chk < 2) return false;

  return true;
};

//birthday validating
const birthdayReg = /\d{4}-\d{2}-\d{2}/;
exports.birthdayValidate = function(birthday) {
  if (!birthday) return false;

  const reg = new RegExp(birthdayReg);
  const valid = reg.test(birthday);
  if (!valid) return false;

  const pieceOfBirthday = birthday.split('-');
  if (pieceOfBirthday[1] > 12 || pieceOfBirthday[2] > 31) return false;

  const standardAge = moment().add(-18, 'year');
  if (moment(standardAge).isBefore(birthday)) return false;

  return true;
};

exports.inputStringFilter = function(inputString) {
  if (!inputString) return inputString;
  return inputString
    .replace('ॣ', '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
