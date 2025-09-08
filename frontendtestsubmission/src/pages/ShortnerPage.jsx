// src/pages/ShortenerPage.jsx
import React, { useState } from "react";
import { Log } from "../utils/loggingClient";
import { loadLinks, saveLinks, findUniqueShortcode, isValidUrl } from "../utils/shortener";

export default function ShortenerPage() {
  const [inputs, setInputs] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [message, setMessage] = useState("");

  const updateInput = (idx, key, value) => {
    const copy = [...inputs]; copy[idx][key] = value; setInputs(copy);
  };

  const addRow = () => {
    if (inputs.length >= 5) return;
    setInputs([...inputs, { longUrl: "", validity: "", shortcode: "" }]);
  };

  const submit = async () => {
    const list = loadLinks();
    try {
      for (const item of inputs) {
        if (!item.longUrl) continue;
        if (!isValidUrl(item.longUrl)) {
          const msg = `Invalid URL: ${item.longUrl}`;
          setMessage(msg);
          await Log("frontend", "warn", "utils", `validation error: ${msg}`);
          return;
        }
        const validity = Number(item.validity) || 30;
        const created = Date.now();
        const expiresAt = validity > 0 ? created + validity * 60000 : null;
        const shortcode = findUniqueShortcode((item.shortcode || "").toLowerCase(), list);
        const entry = { shortcode, longUrl: item.longUrl, createdAt: created, expiresAt, clicks: [] };
        list.push(entry);
        await Log("frontend", "info", "api", `shortlink created: ${shortcode} for ${item.longUrl}`);
      }
      saveLinks(list);
      setMessage("Shortened successfully");
    } catch (err) {
      setMessage("Error: " + err.message);
      try { await Log("frontend", "error", "middleware", "shorten error: " + err.message); } catch {}
    }
  };

  const makeLink = (code) => `${window.location.origin}/r/${code}`;

  return (
    <div style={{ padding: 20 }}>
      <h2>URL Shortener</h2>
      {inputs.map((it, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <input
            placeholder="Long URL"
            value={it.longUrl}
            onChange={(e) => updateInput(idx, "longUrl", e.target.value)}
            style={{ width: "60%" }}
          />
          <input
            placeholder="Validity (min)"
            value={it.validity}
            onChange={(e) => updateInput(idx, "validity", e.target.value)}
            style={{ width: 120, marginLeft: 8 }}
          />
          <input
            placeholder="Preferred shortcode (optional)"
            value={it.shortcode}
            onChange={(e) => updateInput(idx, "shortcode", e.target.value)}
            style={{ width: 180, marginLeft: 8 }}
          />
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <button onClick={addRow} disabled={inputs.length >= 5}>Add another URL</button>
        <button onClick={submit} style={{ marginLeft: 8 }}>Shorten</button>
      </div>
      <div style={{ marginTop: 12 }}>{message}</div>

      <h3 style={{ marginTop: 20 }}>Existing Shortlinks</h3>
      <ShortlinksList />
    </div>
  );
}

function ShortlinksList() {
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem("shortlinks") || "[]"));

  return (
    <div style={{ marginTop: 12 }}>
      {list.length === 0 ? "No links yet" : list.map(l => (
        <div key={l.shortcode} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
          <div><b>{l.shortcode}</b> → <a href={l.longUrl} target="_blank" rel="noreferrer">{l.longUrl}</a></div>
          <div>Link: <a href={makeLink(l.shortcode)}>{makeLink(l.shortcode)}</a></div>
          <div>Expires: {l.expiresAt ? new Date(l.expiresAt).toLocaleString() : "never"}</div>
        </div>
      ))}
    </div>
  );
}

function makeLink(code) { return `${window.location.origin}/r/${code}`; }
