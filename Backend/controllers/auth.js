import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateTokenandSetCookie } from "../utils/generateToken.js";

export async function handleSignup(req, res) {
  try {
    const { fullname, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ fullname });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generateTokenandSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      profilePicUrl: newUser.profilePicUrl,
      bookmarkedEvents: newUser.bookmarkedEvents,
      checkedInEvents: newUser.checkedInEvents,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
}
export async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect)
      return res.status(400).json({ msg: "Invalid credentials" });

    generateTokenandSetCookie(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      bookmarkedEvents: user.bookmarkedEvents,
      checkedInEvents: user.checkedInEvents,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
    console.log(error.message);
  }
}
export async function handleLogout(req, res) {
  try {
    res.cookie("user","",{
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      path: '/',
  });
    res.status(200).json({ msg: "User logged out" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
    console.log(error.message);
  }
}
export async function getMe(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
    console.log(error.message);
  }
}
