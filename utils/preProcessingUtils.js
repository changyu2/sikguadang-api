const url = require("url");

exports.initData = function(req, authRequired) {
  return new Promise(function(resolve, reject) {
    const data = {};
    data.authToken = req.get(apiConst.authTokenHeader);
    data.restoreToken = req.get(apiConst.restoreTokenHeader);
    data.query = req.query;
    data.params = req.params;
    data.body = req.body;
    data.authRequired = authRequired;
    data.now = new Date();
    return resolve(data);
  });
};
function getBaseUrl(urlString) {
  const parsedUrl = url.parse(urlString);
  return parsedUrl.protocol + "//" + parsedUrl.host;
}
