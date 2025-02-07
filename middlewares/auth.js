// Middleware for checking if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized access." });
};

// Middleware for admin-only access
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Admin access only." });
};

// Middleware to check if the user owns the fuel request or is an admin
const isOwnerOrAdmin = (db) => (req, res, next) => {
  const userId = req.session.user.id;
  const requestId = req.params.id;

  // Admins have full access
  if (req.session.user.role === "admin") {
    return next();
  }

  // Check if the fuel request belongs to the current user
  db.query("SELECT user_id FROM abnormalF WHERE id = ?", [requestId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: "Fuel request not found." });
    }

    if (results[0].user_id === userId) {
      return next(); // User owns the request
    }

    res.status(403).json({ message: "Access denied." });
  });
};

module.exports = { isAuthenticated, isAdmin, isOwnerOrAdmin };