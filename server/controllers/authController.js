import Recruiter from '../models/Recruiter.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingRecruiter = await Recruiter.findOne({ email });

    if (existingRecruiter) {
      return res.status(409).json({
        message: "Recruiter already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const recruiter = await Recruiter.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Recruiter successfully created",
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, recruiter.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { recruiterId: recruiter._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
