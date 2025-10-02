require("dotenv").config();
require("./config/dbConnect.js");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
const router = require("./routes/index.js");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);

app.use("/images", express.static("public/images"));

app.use("/api", router);
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
