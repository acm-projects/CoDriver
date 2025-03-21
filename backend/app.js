const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/users");
const historyRoutes = require("./routes/history");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const cors = require("cors");

app.use(cors());

//! Connect to mongodb
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Db connected successfully"))
  .catch((e) => console.log(e));

//! Middlewares
app.use(express.json()); //pass incoming json data from the user
//!Routes
app.use("/", router);
app.use("/api/history", historyRoutes);
//!error handler
app.use(errorHandler);
//! Start the server
const PORT = 8000;
app.listen(PORT, console.log(`Server is up and running`));