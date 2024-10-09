const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const BiddingDB = require("./modules/biddingDB");
const db = new BiddingDB();

app.use(express.json());
HTTP_PORT = 3000;
app.use(cors());

app.get("/api/listing", async (req, res) => {
  try {
    const listing = await db.getAllListings();
    console.log(listing);
    if (listing) {
      console.log("sent json");
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

db.initialize(process.env.MONGODB_CONN_STRING).then((data) => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "404: Page Not Found" });
});
