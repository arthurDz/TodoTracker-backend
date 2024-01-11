const express = require("express");
const verifyToken = require("../middlewares/verifyJWT");
const User = require("../models/user");
const router = express.Router();

// Route for user login
router.get("/getUser", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Found", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured", error });
  }
});

module.exports = router;
