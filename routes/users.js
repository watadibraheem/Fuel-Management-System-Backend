const express = require("express");
const db = require("../config/db").getConnection();
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const bcrypt = require("bcrypt");

const router = express.Router();

// 🔹 Admin Registration Route
router.post("/register", isAuthenticated, isAdmin, (req, res) => {
  const { business_name, email, password, role, phone, contact } = req.body;

  if (!business_name || !email || !password || !phone || !contact) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check for duplicate email
  db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `
      INSERT INTO users (business_name, email, password_hash, role, phone, contact)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [business_name, email, hashedPassword, role || "user", phone, contact],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
          message: "User registered successfully.",
          userId: results.insertId,
        });
      }
    );
  });
});

// 🔹 Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  db.query(
    "SELECT * FROM users WHERE email = ? AND is_deleted = FALSE",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const user = results[0];

      // Compare password
      bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid password" });
        }

        // 🔹 Store user information in session
        req.session.user = {
          id: user.id,
          role: user.role,
          business_name: user.business_name,
        };

        // 🔹 Set the role in an HTTP-only cookie
        res.cookie("role", user.role, { maxAge: 3600000, httpOnly: true }); // 1 hour

        res.json({ message: "Logged in successfully.", user: req.session.user });
      });
    }
  );
});

// 🔹 Logout Route
router.post("/logout", isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed." });
    res.clearCookie("role");
    res.json({ message: "Logged out successfully." });
  });
});

module.exports = router;
