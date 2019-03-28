const express = require("express");
const router = express.Router();
const UsersDocument = require("../../../models/documents/sikguadang/usersDocument");
const bcrypt = require("bcrypt");
const preProcessingUtils = require("../../../utils/preProcessingUtils");
const validator = require("../../../utils/validationUtils");
const authUtils = require("../../../utils/authUtils");
const Promise = require("bluebird");
const moment = require("moment");
const Base64 = require("js-base64").Base64;
const jwt = require("jwt-simple");

// ID CHECK
router.post("/id_check", function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(idConditionCheck)
    .then(function(data) {
      res.status(responseCode.success.status).json(responseCode.success.detail);
    })
    .catch(function(ex) {
      if (ex instanceof Error) {
        log.error(ex.message);
        log.error(ex.stack);
        res.json(ex);
      } else {
        res.json(ex);
      }
    });
});
function idConditionCheck(data) {
  return new Promise(function(resolve, reject) {
    const id = data.body.id;
    if (util.isNullOrUndefined(id)) return reject(responseCode.paramError);
    const isAvailableId = validator.idValidate(id);
    if (isAvailableId === false) return reject(responseCode.idParamError);

    UsersDocument.countDocuments(
      {
        id: id,
        status: apiConst.status.active,
        ldate: { $gt: moment().subtract(1, "years") }
      },
      function(err, count) {
        if (err) return reject(err);
        if (count > 0) return reject(responseCode.idDuplicateError);
        return resolve(data);
      }
    );
  });
}

//SIGN_UP
router.post("/sign_up", function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    // .then(emailConditionCheck)
    .then(passwordConditionCheck)
    .then(createUser)
    .then(function(data) {
      res.status(responseCode.success.status).json(responseCode.success.detail);
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
function passwordConditionCheck(data) {
  return new Promise(function(resolve, reject) {
    const password = data.body.password;
    if (util.isNullOrUndefined(password))
      return reject(responseCode.paramError);
    const isAvailablePassword = validator.passwordValidate(password);
    if (!isAvailablePassword) return reject(responseCode.passwordParamError);
    return resolve(data);
  });
}
function createUser(data) {
  return new Promise(function(resolve, reject) {
    const usersDocument = new UsersDocument();
    usersDocument.userId = data.body.userId;
    usersDocument.password = data.body.password;
    usersDocument.userName = data.body.userName;
    usersDocument.phoneNumber = `${data.body.phoneFirst}-${
      data.body.phoneMiddle
    }-${data.body.phoneLast}`;
    usersDocument.email = `${data.body.emailId}@${data.body.domain}`;

    //Hash Password
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(usersDocument.password, salt, function(err, hash) {
        usersDocument.password = hash;

        //Save Data in DB
        usersDocument.save(function(err, result) {
          if (err) return reject(err);
          data.userDocument = result;
          return resolve(data);
        });
      });
    });
  });
}

//SIGN_IN
router.post("/sign_in", function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(getUserByUserIdAndPassword)
    .then(createToken)
    .then(function(data) {
      res.setHeader(apiConst.authTokenHeader, data.authToken);
      res.setHeader(apiConst.restoreTokenHeader, data.restoreToken);
      res.json(data.user);
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
function getUserByUserIdAndPassword(data) {
  return new Promise(function(resolve, reject) {
    const query = {};
    query.userId = data.body.userId;
    query.password = data.body.password;
    query.status = apiConst.status.active;
    query.ldate = { $gt: moment().subtract(1, "years") };
    const userId = data.body.userId;
    const password = data.body.password;
    // if (!util.isNullOrUndefined(userId) && !util.isNullOrUndefined(password)) {
    //   query.userId = userId;
    // } else {
    //   return reject(responseCode.paramError);
    // }
    UsersDocument.findOneAndUpdate(
      { userId: userId },
      { $set: { ldate: data.now } },
      { new: true },
      function(err, userDocument) {
        if (err) return reject(err);
        if (!userDocument) return reject(responseCode.resourceNotFound);
        bcrypt.compare(password, userDocument.password, function(err, res) {
          if (res == false) {
            return reject(responseCode.signInError);
          }
          ///추후 필요하면 추가.
          const user = {};
          user.userId = userDocument.userId;
          user.userName = userDocument.userName;
          user.phoneNumber = userDocument.phoneNumber;
          user.email = userDocument.email;

          data.user = user;
          return resolve(data);
        });
      }
    );
  });
}
function createToken(data) {
  return new Promise(function(resolve, reject) {
    const userId = data.user.userId;
    const authTokenJwtBody = {};
    authTokenJwtBody.userId = userId;
    authTokenJwtBody.expireTime =
      data.now.getTime() + config.auth.authExpireTime;
    authTokenJwtBody.type = data.user.type;
    data.user.type = undefined;
    const authToken = jwt.encode(authTokenJwtBody, config.auth.authSecret);

    const restoreTokenJwtBody = {};
    restoreTokenJwtBody.userId = userId;
    restoreTokenJwtBody.expireTime =
      data.now.getTime() + config.auth.restoreExpireTime;
    const restoreToken = jwt.encode(
      restoreTokenJwtBody,
      config.auth.restoreSecret
    );

    try {
      data.authToken = authToken;
      data.restoreToken = restoreToken;
      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });
}

///////////////////////////////////////////REISSUE TOKEN////////////////////////////////////////
router.put("/restore", function(req, res, next) {
  preProcessingUtils
    .initData(req, false)
    .then(checkRestoreTokenCondition)
    .then(reissueToken)
    .then(function(data) {
      updateLastLoginDate(data);
      res.setHeader(apiConst.authTokenHeader, data.newAuthToken);
      res.setHeader(apiConst.restoreTokenHeader, data.newRestoreToken);
      res.json(data.user);
    })
    .catch(function(ex) {
      if (ex instanceof Error) {
        log.error(ex.message);
        log.error(ex.stack);
        res
          .status(responseCode.internalError.status)
          .json(responseCode.internalError.detail);
      } else {
        log.error(ex.detail);
        res.status(ex.status).json(ex.detail);
      }
    });
});
function checkRestoreTokenCondition(data) {
  return new Promise(function(resolve, reject) {
    const restoreToken = data.restoreToken;
    if (util.isNullOrUndefined(restoreToken))
      return reject(responseCode.paramError);

    try {
      const restoreDecoded = jwt.decode(
        restoreToken,
        config.auth.restoreSecret
      );
      if (!restoreDecoded) return reject(responseCode.tokenInvalid);

      const authToken = data.authToken;
      if (!util.isNullOrUndefined(authToken)) {
        const authDecoded = jwt.decode(authToken, config.auth.authSecret);
        if (!authDecoded) return reject(responseCode.tokenInvalid);
        if (authDecoded.userEmail !== restoreDecoded.userEmail)
          return reject(responseCode.paramError);
        if (authDecoded.expireTime > data.now.getTime())
          return reject(responseCode.internalError);
      }
      if (restoreDecoded.expireTime < data.now.getTime())
        return reject(responseCode.tokenInvalid);
    } catch (err) {
      log.warning(err.message);
      log.warning(err.stack);
      return reject(responseCode.tokenInvalid);
    }

    const user = {};
    user.userId = restoreDecoded.userId;
    user.type = restoreDecoded.type;
    data.user = user;

    return resolve(data);
  });
}
function reissueToken(data) {
  return new Promise(function(resolve, reject) {
    const authTokenJwtBody = {};
    authTokenJwtBody.userId = data.user.userId;
    authTokenJwtBody.expireTime =
      data.now.getTime() + config.auth.authExpireTime;
    authTokenJwtBody.type = data.user.type;
    const authToken = jwt.encode(authTokenJwtBody, config.auth.authSecret);

    const restoreTokenJwtBody = {};
    restoreTokenJwtBody.userId = data.user.userId;
    restoreTokenJwtBody.expireTime =
      data.now.getTime() + config.auth.restoreExpireTime;
    const restoreToken = jwt.encode(
      restoreTokenJwtBody,
      config.auth.restoreSecret
    );

    try {
      data.newAuthToken = authToken;
      data.newRestoreToken = restoreToken;
      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });
}
function updateLastLoginDate(data) {
  return new Promise(function(resolve, reject) {
    UsersDocument.findOneAndUpdate(
      { userId: authBody.userId },
      { ldate: data.now },
      { new: true },
      function(err, userDocument) {
        if (err) {
          log.error(err.message);
          log.error(err.stack);
        }
        if (userDocument === null) return reject(responseCode.paramError);
        return resolve();
      }
    );
  });
}

module.exports = router;
