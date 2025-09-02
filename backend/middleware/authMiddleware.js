const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        attributes: ["id", "name", "email"],
      });

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      console.log("Authorization Header:", req.headers.authorization);
console.log("Decoded JWT:", decoded);
console.log("User from DB:", req.user);


      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = {protect};
