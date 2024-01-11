const generateJWT = require("../middlewares/generateJWT");
const User = require("../models/user");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists");
      res.status(403).json({ message: "User with this email already exists" });
    } else {
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.status(200).json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.log("Error registering the user: ", error);
    res.status(500).json({ message: "Registeration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Inavalid Email" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Inavalid Password" });
    }
    const token = generateJWT(user);
    res.json({ message: "Logged in successfully", token, user });
  } catch (error) {
    console.log("Login failed: ", error);
    res.status(500).json({ message: "Login failed" });
  }
};
