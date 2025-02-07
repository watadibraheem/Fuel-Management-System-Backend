const express = require("express");
const router = express.Router();
const db = require("../config/db").getConnection();
const {
  isAuthenticated,
  isAdmin,
  isOwnerOrAdmin,
} = require("../middlewares/auth");

// 🔹 Get all fuel requests (Admins can view all, users only their own)
router.get("/", isAuthenticated, (req, res) => {
  const user = req.session.user;

  const query =
    user.role === "admin"
      ? "SELECT * FROM abnormalF"
      : "SELECT * FROM abnormalF WHERE user_id = ?";

  const params = user.role === "admin" ? [] : [user.id];

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔹 Get all pending approval requests (Admin Only)
router.get("/pending-approval", isAuthenticated, isAdmin, (req, res) => {
  db.query("SELECT * FROM abnormalF WHERE status = 'pending-approval'", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔹 Get a specific fuel request (Owner or Admin)
router.get("/:id", isAuthenticated, isOwnerOrAdmin(db), (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM abnormalF WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length)
      return res.status(404).json({ message: "Fuel request not found" });
    res.json(result[0]);
  });
});

// 🔹 Create a new fuel request (Authenticated users)
router.post("/", isAuthenticated, (req, res) => {
  const { name, plate, amount } = req.body;
  const user_id = req.session.user.id;

  if (!name || !plate || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const status = amount <= 200 ? "auto-approved" : "pending-approval";

  const query = `
    INSERT INTO abnormalF (name, plate, amount, user_id, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [name, plate, amount, user_id, status], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const message = status === "auto-approved"
      ? "Fuel request auto-approved."
      : "Fuel request is pending admin approval.";

    res.json({ message, id: results.insertId });
  });
});


// 🔹 Update a fuel request (Owner or Admin)
router.put("/:id", isAuthenticated, isOwnerOrAdmin(db), (req, res) => {
  const { name, plate, amount } = req.body;
  if (!name || !plate || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "UPDATE abnormalF SET name = ?, plate = ?, amount = ? WHERE id = ?";
  db.query(query, [name, plate, amount, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Fuel request not found" });
    res.json({ message: "Fuel request updated" });
  });
});

// 🔹 Delete a fuel request (Owner or Admin)
router.delete("/:id", isAuthenticated, isOwnerOrAdmin(db), (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM abnormalF WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Fuel request not found" });
    res.json({ message: "Fuel request deleted" });
  });
});

// 🔹 Approve a pending request (Admin Only)
router.put("/approve/:id", isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE abnormalF SET status = 'approved', approved_at = NOW() WHERE id = ? AND status = 'pending-approval'",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pending request not found." });
      }
      res.json({ message: "Fuel request approved." });
    }
  );
});

// 🔹 Reject a pending request (Admin Only)
router.put("/reject/:id", isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE abnormalF SET status = 'rejected', rejected_at = NOW() WHERE id = ? AND status = 'pending-approval'",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pending request not found." });
      }
      res.json({ message: "Fuel request rejected." });
    }
  );
});


module.exports = router;
