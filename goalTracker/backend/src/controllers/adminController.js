import { User } from "../models/User.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// @desc Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password field
    return sendSuccess(res, users, "All users retrieved successfully");
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch users", 500);
  }
};

// @desc Delete a user by ID (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, "User not found", 404);

    return sendSuccess(res, null, "User deleted successfully");
  } catch (error) {
    console.error(error);
    return sendError(res, "Error deleting user", 500);
  }
};

// (Optional) Promote a user to admin
export const promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, "User not found", 404);

    user.role = "admin";
    await user.save();

    return sendSuccess(res, user, `User ${user.email} promoted to admin`);
  } catch (error) {
    console.error(error);
    return sendError(res, "Error promoting user", 500);
  }
};
