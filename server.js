const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();

app.use(express.json());
HTTP_PORT = 3000;
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "test.json"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use((req, res) => {
  res.status(404).json({ message: "404: Page Not Found" });
});
