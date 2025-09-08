const axios = require("axios");

async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message: message
      },
      {
        headers: {
          "Content-Type": "application/json",
          // Add auth header if required
          // "Authorization": "Bearer YOUR_TOKEN"
        }
      }
    );
    console.log("Log sent successfully:", response.status);
  } catch (error) {
    console.error("Error sending log:", error.message);
  }
}

module.exports = Log;
