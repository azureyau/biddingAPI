const mongoose = require('mongoose')
const BiddingSchema = require('./biddingSchema')

module.exports = class BiddingDB {
  constructor() {
    this.Biddinglist = {}
    this.Biddinglist['daniel'] = null
    this.Biddinglist['rani'] = null
    this.Biddinglist['jacky'] = null
    this.Biddinglist['standard'] = null
    this.Biddinglist['test'] = null
  }
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(connectionString)

      db.once('error', (err) => {
        reject(err)
      })
      db.once('open', () => {
        this.Biddinglist['standard'] = db.model(
          'standardbiddings',
          BiddingSchema
        )
        this.Biddinglist['daniel'] = db.model('danielbiddings', BiddingSchema)
        this.Biddinglist['jacky'] = db.model('jackybiddings', BiddingSchema)
        this.Biddinglist['rani'] = db.model('ranibiddings', BiddingSchema)
        this.Biddinglist['test'] = db.model('testbiddings', BiddingSchema)
        resolve()
      })
    })
  }
  async updateBid(playerName, objID, updateData) {
    // Check if the ObjectId is valid
    if (!mongoose.Types.ObjectId.isValid(objID)) {
      throw new Error('Invalid ObjectId')
    }

    // Perform the update
    return this.Biddinglist[playerName]
      .findByIdAndUpdate(objID, updateData, {
        new: true,
        runValidators: true,
      })
      .exec()
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
  async addNewResponse(req) {
    try {
      const newbid = new this.Biddinglist[req.params.playerName](req.body)

      let reversePreSeq = req.body.previous_seq.slice().reverse()
      for (const bidID of reversePreSeq) {
        let lastbid = await this.Biddinglist[req.params.playerName].findById(
          bidID
        )
        console.log(lastbid.bidName)
        if (!lastbid.universal) {
          lastbid.response.push(newbid._id)
          lastbid.save()
          break
        }
      }

      // console.log('here,', newbid, req.params.playerName)
      return newbid.save()
    } catch (error) {
      console.error('Error saving bid:', error)
    }
  }

  // addNewResponse(player, bidsArray, newBidData) {
  //   // Build the base query to find the player's agreement
  //   let query = { player: player }
  //   let currentResponsePath = 'agreement.response'
  //   let currentPushPath = 'agreement.response'

  //   bidsArray.forEach((bid, index) => {
  //     query[`${currentResponsePath}.bid`] = bid.bid
  //     currentResponsePath += '.response'
  //     currentPushPath += `.$[layer${index}].response`
  //   })
  //   console.log(bidsArray)

  //   // Prepare the $push operation targeting the deepest response array
  //   let pushOperation = {
  //     $push: {},
  //   }
  //   pushOperation.$push[`${currentPushPath}`] = newBidData

  //   // Create array filters for each bid layer
  //   let arrayFilters = bidsArray.map((bid, index) => ({
  //     [`layer${index}.bid`]: bid.bid,
  //   }))

  //   console.log('Query:', query)
  //   console.log('Push Operation:', pushOperation)
  //   console.log('Array Filters:', arrayFilters)

  //   console.log(
  //     query,
  //     pushOperation,
  //     {
  //       arrayFilters: arrayFilters,
  //     },
  //     { new: true }
  //   )
  //   // Execute the update operation
  //   return this.Biddinglist.findOneAndUpdate(
  //     query,
  //     pushOperation,
  //     {
  //       arrayFilters: arrayFilters,
  //     },
  //     { new: true }
  //   )
  //     .then((result) => {
  //       console.log('Update Result:', result)
  //       return result
  //     })
  //     .catch((err) => {
  //       console.error('Update Error:', err)
  //       throw err
  //     })
  // }
  async getBidByID(playerName, objID) {
    if (!mongoose.Types.ObjectId.isValid(objID)) {
      throw new Error('Invalid ObjectId')
    }
    return await this.Biddinglist[playerName].findById(objID).exec()
  }

  async getAllListings(playerName) {
    return await this.Biddinglist[playerName].find({}).exec()
  }

  async getObjResponse(playerName, objID) {
    try {
      const obj = await this.Biddinglist[playerName]
        .findById(objID)
        .populate({ path: 'response', model: `${playerName}biddings` })
      if (!obj) {
        throw new Error('Object not found')
      }
      const responseList = obj.response

      const universalListings = await this.Biddinglist[playerName].find({
        universal: true,
      })

      // Combine both responseList and universalListings
      const combinedResults = [...responseList, ...universalListings]

      return combinedResults
    } catch (error) {
      console.error('Error fetching object responses:', error)
      throw error // Rethrow or handle the error as needed
    }
  }

  async getStartBid(playerName) {
    return await this.Biddinglist[playerName]
      .find({
        $or: [
          { previous_seq: { $exists: false } },
          { previous_seq: { $size: 0 } },
        ],
      })
      .exec()
  }

  // async getListingByName(playerName) {
  //   return await this.Biddinglist.findOne({ player: playerName }).exec()
  // }
}
