import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { config } from "../config/config.js";

/**
 * Protect routes – only allow authenticated users
 * Sets req.user to the logged-in user
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    // Verify token - use same secret as application
    const secret = config.jwtSecret;
    const decoded = jwt.verify(token, secret);

    // Find the user by decoded ID
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
