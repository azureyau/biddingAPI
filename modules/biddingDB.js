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
  /*
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

        function findResponseByName(curResList, auctionList, currentIndex) {
          if (currentIndex >= auctionList.length) {
            return curResList;
          }

          const currentAuction = auctionList[currentIndex];
          let foundObj = null;
          for (let e of curResList.response) {
            if (e.bid === currentAuction.bid) {
              foundObj = e;
              break;
            }
          }

          if (foundObj) {
            return findResponseByName(foundObj, auctionList, currentIndex + 1);
          }
          throw new Error(`no correspondence response found in system`);
        }

        // Call the updated function starting from the first auction
        let matchingResponse = findResponseByName(agreement, auctionSeq, 0);
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
      */
  /*
  async pushANewResponse(auctionSeq, playerName, newBid) {
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

        function findResponseByName(curResList, auctionList, currentIndex) {
          if (currentIndex >= auctionList.length) {
            return curResList;
          }

          const currentAuction = auctionList[currentIndex];
          let foundObj = null;
          for (let e of curResList.response) {
            if (e.bid === currentAuction.bid) {
              foundObj = e;
              break;
            }
          }

          if (foundObj) {
            return findResponseByName(foundObj, auctionList, currentIndex + 1);
          }
          throw new Error(`no correspondence response found in system`);
        }

        // Call the updated function starting from the first auction
        let matchingResponse = findResponseByName(agreement, auctionSeq, 0);
        if (!matchingResponse) {
          throw new Error(
            `No matching response found for the bids in auctionList: ${JSON.stringify(
              auctionSeq
            )}`
          );
        }

        matchingResponse.response.push(newBid);
      });
  }
*/

  //Data need "playerName", "bidSequence" and "newBid"
  addNewResponse(player, bidsArray, newBidData) {
    // Build the base query to find the player's agreement
    let query = { player: player };
    let currentResponsePath = "agreement.response";
    let currentPushPath = "agreement.response";

    bidsArray.forEach((bid, index) => {
      query[`${currentResponsePath}.bid`] = bid.bid;
      currentResponsePath += ".response";
      currentPushPath += `.$[layer${index}].response`;
    });
    console.log(bidsArray);

    // Prepare the $push operation targeting the deepest response array
    let pushOperation = {
      $push: {},
    };
    pushOperation.$push[`${currentPushPath}`] = newBidData;

    // Create array filters for each bid layer
    let arrayFilters = bidsArray.map((bid, index) => ({
      [`layer${index}.bid`]: bid.bid,
    }));

    console.log("Query:", query);
    console.log("Push Operation:", pushOperation);
    console.log("Array Filters:", arrayFilters);

    console.log(
      query,
      pushOperation,
      {
        arrayFilters: arrayFilters,
      },
      { new: true }
    );
    // Execute the update operation
    return this.Playerlist.findOneAndUpdate(
      query,
      pushOperation,
      {
        arrayFilters: arrayFilters,
      },
      { new: true }
    )
      .then((result) => {
        console.log("Update Result:", result);
        return result;
      })
      .catch((err) => {
        console.error("Update Error:", err);
        throw err;
      });
  }
  async getAllListings() {
    let [result] = await this.Playerlist.find({}).exec();
    return result;
  }
};
