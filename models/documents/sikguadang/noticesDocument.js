const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const noticeSchema = mongoose.Schema({
  title: String,
  text: String,
  imageCards: [],
  status: { type: String, default: apiConst.status.active },
  sdate: { type: Date, default: Date.now },
  cdate: { type: Date, default: Date.now },
  edate: { type: Date, default: Date.now },
  authorId: { type: ObjectId, ref: 'Author' }
});

module.exports = mongoose.model('Notice', noticeSchema);
