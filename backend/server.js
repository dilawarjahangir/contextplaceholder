const app = require("./app");
const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    console.error(`Shutting down the server due to an uncaught exception`);
    process.exit(1);
  });
  
// Config
dotenv.config({ path: "config/.env" });


const PORT = process.env.PORT || 8001;

// Create server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    console.error(`Shutting down the server due to an unhandled promise rejection`);
  
    server.close(() => {
      process.exit(1);
    });
    
  });
  



