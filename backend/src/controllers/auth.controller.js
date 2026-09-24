import { sendWelcomeEmail, sendOtpEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

// STEP 1: Generate & send 6-digit OTP
export const sendOtp = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if verified user exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email is already registered. Please sign in." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser) {
      // Update existing unverified user record
      existingUser.fullName = fullName;
      existingUser.password = hashedPassword;
      existingUser.verificationOtp = otp;
      existingUser.verificationOtpExpires = otpExpires;
      await existingUser.save();
    } else {
      // Create new unverified user
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        verificationOtp: otp,
        verificationOtpExpires: otpExpires,
        isVerified: false,
      });
      await newUser.save();
    }

    // Send OTP via email
    await sendOtpEmail(email, fullName, otp);

    res.status(200).json({
      message: "Verification OTP code sent to your email",
      email,
    });
  } catch (error) {
    console.error("Error in sendOtp controller:", error);
    res.status(500).json({ message: "Failed to send OTP code" });
  }
};

// STEP 2: Verify OTP and complete registration
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP code are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Registration record not found. Please sign up again." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified. Please sign in." });
    }

    if (!user.verificationOtpExpires || user.verificationOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP code has expired. Please request a new code." });
    }

    if (user.verificationOtp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP verification code" });
    }

    // Mark user verified
    user.isVerified = true;
    user.verificationOtp = "";
    user.verificationOtpExpires = null;
    await user.save();

    generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });

    try {
      await sendWelcomeEmail(user.email, user.fullName, ENV.CLIENT_URL);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  } catch (error) {
    console.error("Error in verifyOtp controller:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

export const signup = async (req, res) => {
  // Legacy / fallback route - redirects to sendOtp flow
  return sendOtp(req, res);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    // never tell the client which one is incorrect: password or email

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => {
  const isProduction = ENV.NODE_ENV === "production";
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
