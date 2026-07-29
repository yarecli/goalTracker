import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/config.js";

// Generate JWT
const generateToken = (id) => jwt.sign({ id }, config.jwtSecret, { expiresIn: "7d" });

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ username, email, password });

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
    token: generateToken(user.id)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    token: generateToken(user.id)
  });
};

// Fetch the logged-in user's profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "createdAt", "updatedAt"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Logout user (client should remove token)
export const logoutUser = (req, res) => {
  // Since JWT is stateless, logout is handled client-side.
  // Here we can just send a response to indicate success
  res.json({ message: "Logged out successfully" });
};