const fs = require("fs");
const path = require("path");

// Get the list of files
exports.getFiles = (req, res) => {
  const directoryPath = path.join(__dirname, "../textfiles");
// Read the files in the 'public' folder
fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading files:", err);
      res.status(500).json({ message: 'Error reading files' });
      return;
    }

    // Filter only the .txt files (exclude directories)
    const txtFiles = files.filter(file => file.endsWith('.txt') && fs.lstatSync(path.join(directoryPath, file)).isFile());

    console.log('Files found:', txtFiles); // Logs the files to the server console

    res.status(200).json(txtFiles); // Send the list of .txt files to the frontend
  });
};

// Get content of a specific file
exports.getFileContent = (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "../textfiles", fileName);

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      res.status(200).send(content);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Unable to read file" });
  }
};
