// FrontendTestSubmission/src/App.js
import React, { useState } from "react";
import { Log } from "./utils/loggingClient";

function App() {
  const [status, setStatus] = useState("");

  async function sendFrontendLog() {
    setStatus("sending...");
    try {
      const res = await Log("frontend","info","api","Test frontend log from React");
      setStatus("ok: " + JSON.stringify(res));
    } catch (e) {
      setStatus("error: " + e.message);
    }
  }

  async function sendInvalidLog() {
    setStatus("sending invalid...");
    try {
      // deliberately invalid package to test error/logging
      await Log("frontend","info","handler","this should fail package validation on server maybe");
      setStatus("ok");
    } catch (e) {
      setStatus("error: " + e.message);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Logging Test</h1>
      <button onClick={sendFrontendLog} style={{ marginRight: 8 }}>Send frontend log</button>
      <button onClick={sendInvalidLog}>Send invalid log</button>
      <pre style={{ marginTop: 12 }}>{status}</pre>
      <p>Make sure you created FrontendTestSubmission/.env locally with REACT_APP_LOG_API_TOKEN</p>
    </div>
  );
}

export default App;
