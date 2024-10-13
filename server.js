const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const BiddingDB = require("./modules/biddingDB");
const db = new BiddingDB();

app.use(express.json());
app.use(cors());

app.get("/api/listings", async (req, res) => {
  res.redirect("/api/listing");
});

app.get("/api/listing", async (req, res) => {
  try {
    const listing = await db.getAllListings();

    if (listing) {
      res.status(200).json(listing);
    } else {
      console.log("data note found");
      res.status(404).json({ message: "data not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
  //res.sendFile(path.join(__dirname, "test.json"));
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "test.json"));
});
/////////////////////////////////////////////////////

app.get("/test", async (req, res) => {
  try {
    const templist = [{ bid: "1c" }, { bid: "1s" }, { bid: "3s" }];
    // const templist = [{ bid: "1c" }, { bid: "1d" }, { bid: "1h" }];
    const newBid = {
      bid: "3n",
      meaning: "asking for shortness",
      author: "JY",
      update_date: "13/Oct/2024",
    };
    let systemBid = await db.addNewResponse("Daniel", templist, newBid);
    console.log(systemBid.matchedCount);
    const listing = await db.getAllListings();
    res.json(listing);
  } catch (error) {
    console.log(error);
    res.json({ message: error, error: "no test result" });
  }
});

app.post("/api/listings", async (req, res) => {
  try {
    const listing = await db.addNewResponse(
      req.body.playerName,
      req.body.bidSequence,
      req.body.newBid
    );
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/listings/1", async (req, res) => {
  try {
    const listing = await db.addNewResponse(
      req.body.playerName,
      req.body.bidSequence,
      req.body.newBid
    );
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "404: Page Not Found" });
});
