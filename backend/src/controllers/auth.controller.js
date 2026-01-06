import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (password.length < 7) {
      return res
        .status(400)
        .json({ message: "Password must be of 7 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    let profile;
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      if (role === "patient") {
        profile = await Patient.create({
          userId: newUser._id,
          age: null,
          gender: null,
          weight: null,
        });
      }
      if (role === "doctor") {
        profile = await Doctor.create({
          userId: newUser._id,
          licenseNumber: null,
          specialization: "",
          experience: null,
          fees: null,
          profileImage: null,
        });
      }
      res
        .status(200)
        .json({
          message: "user registered successfully",
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          profile,
        });
    } else {
      return res.status(400).json({ message: "Invalid user Data" });
    }
  } catch (error) {
    console.log("Error in signup Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      message: "Login successfull",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in login Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error logging out", error: err.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching the user", error: err.message });
  }
};
