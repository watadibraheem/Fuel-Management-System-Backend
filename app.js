const express = require("express");
const cors = require("cors");
const fuelRequestsRoutes = require("./routes/fuelRequests");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/fuel-requests", fuelRequestsRoutes);

// Start Server
const PORT = process.env.PORT || 8801;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
