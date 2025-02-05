const express = require("express");
const router = express.Router();
const dbSingleton = require("../config/db");

const db = dbSingleton.getConnection();

// 🔹 Get all fuel requests
router.get("/", (req, res) => {
  const query = "SELECT * FROM abnormalF";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// 🔹 Get a specific fuel request by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM abnormalF WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length)
      return res.status(404).json({ message: "Fuel request not found" });
    res.json(result[0]);
  });
});

// 🔹 Create a new fuel request
router.post("/", (req, res) => {
  const { name, plate, amount, user_id } = req.body;
  if (!name || !plate || !amount || !user_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query("SELECT id from users WHERE id = ?", [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0)
      return res.status(400).json({ message: "User does not exist" });

    // Check the amount
    if (amount <= 200) {
      const query =
        "INSERT INTO abnormalF (name, plate, amount, user_id) VALUES (?, ?, ?, ?)";
      db.query(query, [name, plate, amount, user_id], (err, results) => {
        if (results.affectedRows === 0)
          return res.status(404).json({ message: "User not found" });
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.json({ message: "Fuel request added ", id: results.insertId });
      });
    } else {
      // we'll update this later
      res.json({ message: "Fuel request is pending Manager approval." });
    }
  });
});

// 🔹 Update a fuel request
router.put("/:id", (req, res) => {
  const { name, plate, amount } = req.body;
  if (!name || !plate || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const query =
    "UPDATE abnormalF SET name = ?, plate = ?, amount = ? WHERE id = ?";
  db.query(query, [name, plate, amount, req.params.id], (err, results) => {
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Fuel request not found" });
    else if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "Fuel request updated " });
  });
});

// 🔹 Delete a fuel request
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM abnormalF WHERE id = ?", [id], (err, results) => {
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Fuel request not found" });
    else if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Fuel request deleted" });
  });
});

module.exports = router;
