const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  bid: { type: String, required: true },
  meaning: { type: String, required: true },
  author: { type: String, required: true },
  update_date: { type: String, required: true },
  response: [],
});

ResponseSchema.response = ResponseSchema;

const AgreementSchema = new Schema({
  response: [ResponseSchema],
});

const PlayerListSchema = new Schema({
  player: { type: String, required: true },
  agreement: AgreementSchema,
});

module.exports = PlayerListSchema;
