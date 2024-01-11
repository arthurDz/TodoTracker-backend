const express = require("express");
const connectDB = require("./database");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("../routes/authRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware setup
app.use(express.json());

app.use("/auth", authRoutes);
app.get("/todo", (req, res) => res.json({ message: "Todo here!!!" }));
// Normal routes
// app.use('/api', routes);

module.exports = app;
