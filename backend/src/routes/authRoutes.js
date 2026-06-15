const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../config/db");

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      roll_number,
      department,
      semester,
      phone
    } = req.body;

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users
    const userResult = await pool.query(
      `INSERT INTO users
      (name, email, password_hash, role)
      VALUES ($1,$2,$3,$4)
      RETURNING id`,
      [name, email, hashedPassword, "student"]
    );

    const userId = userResult.rows[0].id;

    // Insert into students
    await pool.query(
      `INSERT INTO students
      (user_id, roll_number, department, semester, phone)
      VALUES ($1,$2,$3,$4,$5)`,
      [
        userId,
        roll_number,
        department,
        semester,
        phone
      ]
    );

    res.status(201).json({
      message: "Student registered successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed"
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];
    let student = null;
    if (user.role === "student") {
      const studentRes = await pool.query(
        "SELECT id, roll_number, department, semester, phone FROM students WHERE user_id = $1",
        [user.id]
      );
      student = studentRes.rows[0] || null;
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: student?.id || null,
        rollNumber: student?.roll_number || null,
        department: student?.department || null,
        semester: student?.semester || null,
        phone: student?.phone || null,
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });
  }
});
module.exports = router;