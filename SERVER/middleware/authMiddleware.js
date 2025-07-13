const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Authorization header");
      return res.status(401).json({ message: 'Unauthorized: No token' });
    }

    const token = authHeader.split(" ")[1]; // ✅ Extract from header
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      console.log("❌ Token decoded but user not found in DB");
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = { id: user._id, email: user.email };
    next();
  } catch (err) {
    console.log("❌ Invalid token or JWT error", err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
