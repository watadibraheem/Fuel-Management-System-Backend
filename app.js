const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();

const fuelRequestsRoutes = require("./routes/fuelRequests");
const userRoutes = require("./routes/users");

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "fuel_management_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // 1 hour session expiration
  })
);

// Routes
app.use("/fuel-requests", fuelRequestsRoutes);
app.use("/users", userRoutes);

// Start Server
const PORT = process.env.PORT || 8801;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
