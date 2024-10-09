const mongoose = require("mongoose");
const PlayerListSchema = require("./listingSchema");

module.exports = class BiddingDB {
  constructor() {
    this.Playerlist = null;
  }
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(connectionString);

      db.once("error", (err) => {
        reject(err);
      });
      db.once("open", () => {
        this.Playerlist = db.model("conventions", PlayerListSchema);
        console.log("opened", this.Playerlist);
        resolve();
      });
    });
  }
  getAllListings() {
    return this.Playerlist.find({}).exec();
  }
};
