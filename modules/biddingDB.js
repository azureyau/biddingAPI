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
        resolve();
      });
    });
  }

  async getCurrentObject(auctionSeq, playerName) {
    return this.Playerlist.findOne({ player: playerName })
      .exec()
      .then((curObj) => {
        if (!curObj) {
          throw new Error(`Player ${playerName} not found`);
        }

        let agreement = curObj.agreement;

        // Check if agreement and response are valid
        if (
          !agreement ||
          !Array.isArray(agreement.response) ||
          agreement.response.length === 0
        ) {
          throw new Error(`No agreement found for player ${playerName}`);
        }

        function findResponseByName(responses, auctionList, currentIndex) {
          if (currentIndex >= auctionList.length) {
            return responses;
          }

          const currentAuction = auctionList[currentIndex];
          let foundResponse = null;

          for (const resp of responses) {
            console.log(
              "resp.bid === currentAuction.bid",
              resp.bid,
              currentAuction.bid
            );
            if (resp.bid === currentAuction.bid) {
              foundResponse = resp;
              break;
            }
          }

          if (foundResponse) {
            if (foundResponse.response && foundResponse.response.length > 0) {
              return findResponseByName(
                foundResponse.response,
                auctionList,
                currentIndex + 1
              );
            }
            throw new Error(`no correspondence response found in system`);
          }
          return null;
        }

        // Call the updated function starting from the first auction
        let matchingResponse = findResponseByName(
          agreement.response,
          auctionSeq,
          0
        );
        if (!matchingResponse) {
          throw new Error(
            `No matching response found for the bids in auctionList: ${JSON.stringify(
              auctionSeq
            )}`
          );
        }
        console.log("start", matchingResponse, "--=");
        return matchingResponse; // Return the response object
      });
  }

  getAllListings() {
    return this.Playerlist.find({}).exec();
  }
};
