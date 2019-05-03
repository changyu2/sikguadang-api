const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeItemSchema = new Schema({
  title: String,
  description: String,
  thumbnailUrl: [],
  price: Number,
  discountPrice: Number,
  optionItem1Name: String,
  optionItem1Price: Number,
  optionItem2Name: String,
  optionItem2Price: Number,
  optionItem3Name: String,
  optionItem3Price: Number,
  optionItem4Name: String,
  optionItem4Price: Number,
  category: Number,
  soldOut: { type: Boolean, default: false },
  limited: { type: Boolean, default: false },
  hot: { type: Boolean, default: false },
  new: { type: Boolean, default: false },
  status: { type: String, default: apiConst.status.active },
  cdate: { type: Date, default: Date.now },
  sdate: { type: Date, default: Date.now },
  edate: { type: Date, default: Date.now },
  authorId: { type: Schema.Types.ObjectId, ref: 'Author' },
  productDetailCards: [],
  productInfoCards: []
});

module.exports = mongoose.model('StoreItem', storeItemSchema);
