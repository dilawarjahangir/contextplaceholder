import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
const Home = () => {
  const [files, setFiles] = useState([]); // Store the list of files
  const [selectedFile, setSelectedFile] = useState(""); // Store the selected file name
  const [fileContent, setFileContent] = useState(""); // File content
  const [variables, setVariables] = useState([]); // Variables in the file

  // Handle file selection
  const handleFileSelection = (event) => {
    const fileName = event.target.value;
    setSelectedFile(fileName);
    fetchFileContent(fileName);
  };

  // Fetch file content
  const fetchFileContent = async (fileName) => {
    try {
      const response = await fetch(
        `http://localhost:8010/api/files/${fileName}`
      );
      const text = await response.text();

      // Extract variables wrapped in {{ }}
      const extractedVariables = [...text.matchAll(/{{(.*?)}}/g)].map(
        (match, index) => ({
          id: index + 1,
          key: match[1].trim(),
          value: "",
        })
      );

      setFileContent(text);
      setVariables(extractedVariables);
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
  };

  // Fetch the list of files when the component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:8010/api/files");
        const fileList = await response.json();
        console.log("Files fetched:", fileList); // Add logging to check fetched files
        setFiles(fileList);

        if (fileList.length > 0) {
          setSelectedFile(fileList[0]); // Set default selected file
          fetchFileContent(fileList[0]); // Load content of the first file
        }
      } catch (error) {
        console.error("Error fetching file list:", error);
      }
    };

    fetchFiles();
  }, []);

  // Handle variable input changes
  const handleInputChange = (id, value) => {
    setVariables((prevVars) =>
      prevVars.map((variable) =>
        variable.id === id ? { ...variable, value } : variable
      )
    );
  };

  // Copy updated file content to clipboard
// Copy updated file content to clipboard with fallback
const copyUpdatedFile = () => {
  const updatedContent = getUpdatedFileContent();

  // Check if Clipboard API is available and secure context
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(updatedContent)
      .then(() => {
        toast.success("Text copied to clipboard!");
      })
      .catch((error) => {
        toast.error("Failed to copy text to clipboard");
        console.error(error);
      });
  } else {
    // Fallback method using a temporary textarea
    const textArea = document.createElement("textarea");
    textArea.value = updatedContent;

    // Prevent scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        toast.success("Text copied to clipboard!");
      } else {
        toast.error("Failed to copy text to clipboard");
      }
    } catch (err) {
      toast.error("Failed to copy text to clipboard");
      console.error(err);
    }

    document.body.removeChild(textArea);
  }
};


  // Get updated file content by replacing variables
  const getUpdatedFileContent = () => {
    let updatedContent = fileContent;
    variables.forEach((variable) => {
      const regex = new RegExp(`{{${variable.key}}}`, "g");
      updatedContent = updatedContent.replace(regex, variable.value);
    });
    return updatedContent;
  };

  // Clear all input fields
  const clearFields = () => {
    setVariables(variables.map((variable) => ({ ...variable, value: "" })));
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-4">File Content</h1>
        <pre className="whitespace-pre-wrap">{fileContent}</pre>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-200 p-6">
        {/* File Selection */}
        <div className="mb-4">
          <label
            htmlFor="file-select"
            className="block text-lg font-semibold mb-2"
          >
            Select a File:
          </label>
          <select
            id="file-select"
            value={selectedFile}
            onChange={handleFileSelection}
            className="border p-2 rounded w-full"
          >
            {files.map((file, index) => (
              <option key={index} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>

        {/* Table Structure for Variables */}
        <table className="table-auto w-full mb-4 border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Variable-Key</th>
              <th className="px-4 py-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable) => (
              <tr key={variable.id} className="border-b">
                <td className="px-4 py-2">{variable.id}</td>
                <td className="px-4 py-2">{variable.key}</td>
                <td className="px-4 py-2">
                  <textarea
                    className="border p-2 w-full"
                    rows="4"
                    placeholder={`Enter ${variable.key}`}
                    value={variable.value}
                    onChange={(e) =>
                      handleInputChange(variable.id, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={copyUpdatedFile}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Copy Updated File
          </button>
          <button
            onClick={clearFields}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
