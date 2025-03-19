const express = require("express");
const router = express.Router();
const fileController = require("../controller/files");

// Define routes
router.get("/", fileController.getFiles); // List files
router.get("/:fileName", fileController.getFileContent); // File content

module.exports = router;
