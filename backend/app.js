const express = require('express');
const ErrorHandler = require('./middleware/error');
const app = express();
const cors= require("cors");
const fileRoutes = require("./routes/fileRoutes");



// Middleware setup
app.use(cors());

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});


// File routes
app.use("/api/files", fileRoutes);



// Error handling middleware
app.use(ErrorHandler); 

// Export the app
module.exports = app;
 