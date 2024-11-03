const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ResponseSchema = new Schema({
  bid: { type: String, required: true },
  meaning: { type: String, required: true },
  author: { type: String, required: true },
  update_date: { type: String, required: true },
  response: [{ type: Schema.Types.ObjectId, ref: 'Response' }],
  fv: { type: Boolean },
  uf: { type: Boolean },
  vul: { type: Boolean },
  non_vul: { type: Boolean },
  previous_seq: [{ type: Schema.Types.ObjectId, ref: 'Response' }],
})

ResponseSchema.response = ResponseSchema

const AgreementSchema = new Schema({
  response: [ResponseSchema],
})

const PlayerListSchema = new Schema({
  player: { type: String, required: true },
  agreement: AgreementSchema,
})

module.exports = PlayerListSchema
