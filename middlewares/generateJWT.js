const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );
  return token;
};

module.exports = generateJWT;
