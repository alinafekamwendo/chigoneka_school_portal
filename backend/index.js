const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route.js");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const db = require("./models");
const cors = require("cors");

//API VERSION
const apiVersion = process.env.API_VERSION;
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/profilephotos",
  express.static(path.join(__dirname, "uploads/profilephoto"))
);
// API routes

app.use(`/${apiVersion}/auth`, authRoutes);

// Home route
app.get(`/${apiVersion}`, (req, res) => {
  res.status(200).json({ Message: "Portal API running !!" });
});

// Catch-all route for S
app.get("*", (req, res) => {
  // res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  res.status(401).json({ Error: "Url is invalid" });
});

// Error handler
app.use((error, req, res, next) => {
  // Default to 500 if no status code provided
  const statusCode = error.statusCode || error.status || 500;

  // Don't expose stack traces in production
  const response = {
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };
  
if (error.isJoi) {
  return res.status(400).json({
    type: "VALIDATION_ERROR",
    errors: error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message.replace(/['"]/g, ""),
    })),
  });
}

// Handle Sequelize validation errors
if (error.name === "SequelizeValidationError") {
  return res.status(400).json({
    type: "DATABASE_VALIDATION_ERROR",
    errors: error.errors.map((e) => ({
      field: e.path,
      message: e.message,
    })),
  });
}
  // Log the error
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: error.message,
    statusCode,
    path: req.path,
    method: req.method,
    stack: error.stack,
  });

  // Send response
  res.status(statusCode).json(response);

  // Don't call next(error) here - this should be the last middleware
  // Calling next() would continue to the default Express error handler
});
// Start the server
const port = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/api/v1`);
  });
});
