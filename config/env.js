const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

module.exports = {
  mongoURI: process.env.MONGO_URI,
  PORT: 3000,
};
