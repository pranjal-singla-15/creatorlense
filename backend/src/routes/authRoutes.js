import express from "express";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    brandName: user.brandName,
    brandDescription: user.brandDescription,
    brandWebsite: user.brandWebsite,
    brandIndustry: user.brandIndustry,
    brandLocation: user.brandLocation,
    brandProfileCompleted: user.brandProfileCompleted,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      token: createToken(user._id),
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: createToken(user._id),
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/onboarding", protect, async (req, res, next) => {
  try {
    const {
      brandName,
      brandDescription,
      brandWebsite,
      brandIndustry,
      brandLocation,
    } = req.body;

    if (!brandName || !brandDescription) {
      return res.status(400).json({ message: "Brand name and description are required" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.brandName = brandName.trim();
    user.brandDescription = brandDescription.trim();
    user.brandWebsite = brandWebsite?.trim() || "";
    user.brandIndustry = brandIndustry?.trim() || "";
    user.brandLocation = brandLocation?.trim() || "";
    user.brandProfileCompleted = true;

    await user.save();

    res.json({
      message: "Brand profile saved",
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
