const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv').config()
const BiddingDB = require('./modules/biddingDB')
const db = new BiddingDB()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.put('/api/listings/:playerName', async (req, res) => {
  try {
    const { playerName } = req.params
    const { objID } = req.query
    const updateData = req.body

    // Validate parameters
    if (!objID) {
      return res
        .status(400)
        .json({ message: 'objID is required as a query parameter.' })
    }
    console.log('put req:', req.body)
    // Verify that the playerName exists in the Biddinglist
    if (!db.Biddinglist[playerName]) {
      return res.status(404).json({ message: 'Player collection not found' })
    }

    // Use the specified collection and update the document by ID
    const updatedBidding = await db.updateBid(playerName, objID, updateData)
    console.log(updatedBidding)
    if (updatedBidding) {
      res.status(200).json(updatedBidding)
    } else {
      res.status(404).json({ message: 'Document not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/api/listing/test/:objID', async (req, res) => {
  try {
    console.log(req.params.objID)
    const obj = await db.getBidByID('standard', req.params.objID)
    if (obj) {
      res.status(200).json(obj)
    } else {
      res.status(404).json({ message: 'data not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

app.get('/api/listings/:playerName', async (req, res) => {
  try {
    const { objID } = req.query
    let listing
    if (!objID) {
      listing = await db.getStartBid(req.params.playerName)
    } else {
      listing = await db.getObjResponse(req.params.playerName, objID)
    }

    if (listing) {
      res.status(200).json(listing)
    } else {
      console.log('data note found')
      res.status(404).json({ message: 'data not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'test.json'))
})

app.post('/api/listings/:playerName', async (req, res) => {
  try {
    console.log(req.body)
    const listing = await db.addNewResponse(req)
    res.status(201).json(listing)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/listings/1', async (req, res) => {
  try {
    const listing = await db.addNewResponse(
      req.body.playerName,
      req.body.bidSequence,
      req.body.newBid
    )
    res.status(201).json(listing)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(port, () => {
    console.log('Server is running on port 3000')
  })
})

app.use((req, res) => {
  res.status(404).json({ message: '404: Page Not Found' })
})
