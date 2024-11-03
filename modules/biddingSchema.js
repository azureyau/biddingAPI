const mongoose = require('mongoose')
const Schema = mongoose.Schema

var BiddingSchema = new Schema({
  bidName: { type: String, required: true },
  meaning: { type: String, required: true },
  author: { type: String },
  update_date: { type: String },
  response: [{ type: Schema.Types.ObjectId }],
  fv: { type: Boolean },
  uf: { type: Boolean },
  vul: { type: Boolean },
  non_vul: { type: Boolean },
  previous_seq: [{ type: Schema.Types.ObjectId }],
  universal: { type: Boolean },
  opp_bid: { type: Boolean },
})

module.exports = BiddingSchema
