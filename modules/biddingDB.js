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
          // If we've processed all auctions, return null
          if (currentIndex >= auctionList.length) {
            return null;
          }

          const currentAuction = auctionList[currentIndex]; // Get the current auction
          let foundResponse = null; // Variable to store found response

          // Iterate through the current responses
          for (const resp of responses) {
            console.log(
              "resp.bid === currentAuction.bid",
              resp.bid,
              currentAuction.bid
            );
            if (resp.bid === currentAuction.bid) {
              foundResponse = resp; // Store the found response
              break; // Exit inner loop if found
            }
          }

          // If a response was found, check for nested responses
          if (foundResponse) {
            // Check for nested responses and continue to the next auction
            if (foundResponse.response && foundResponse.response.length > 0) {
              return findResponseByName(
                foundResponse.response,
                auctionList,
                currentIndex + 1
              );
            }
            return foundResponse; // Return the found response if no nested responses
          }

          // If not found, return null and stop processing
          return null; // No matching response found
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

        return matchingResponse; // Return the response object
      });
  }

  getAllListings() {
    return this.Playerlist.find({}).exec();
  }
};
