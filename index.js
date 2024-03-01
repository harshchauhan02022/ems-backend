// app.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const sequelize = require("./config/db"); // Corrected path

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// Start server
// sequelize.sync()
//    .then(() => {
//     console.log('Database successfully connected');

//     const PORT = process.env.PORT || 8000;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port http://localhost:${PORT}`);
//     });
//    })
//    .catch((err) => {
//      console.error('Error:', err);
 
 const PORT = process.env.PORT || 8000;
 app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);

    });


