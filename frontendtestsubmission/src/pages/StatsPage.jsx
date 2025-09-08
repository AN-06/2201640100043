// src/pages/StatsPage.jsx
import React, { useEffect, useState } from "react";
import { loadLinks, saveLinks, isExpired } from "../utils/shortener";
import { Log } from "../utils/loggingClient";

export default function StatsPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const list = loadLinks();
    setLinks(list);
    Log("frontend", "debug", "middleware", `viewed stats page: ${list.length} links`).catch(() => {});
  }, []);

  const clearExpired = () => {
    const list = loadLinks().filter(x => !isExpired(x));
    saveLinks(list);
    setLinks(list);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Shortener Statistics</h2>
      <button onClick={clearExpired}>Clear expired</button>
      <div style={{ marginTop: 12 }}>
        {links.length === 0 ? "No links yet" : links.map(l => (
          <div key={l.shortcode} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
            <div><b>{l.shortcode}</b> → {l.longUrl}</div>
            <div>Created: {new Date(l.createdAt).toLocaleString()}</div>
            <div>Expires: {l.expiresAt ? new Date(l.expiresAt).toLocaleString() : "never"}</div>
            <div>Total clicks: {l.clicks.length}</div>
            <details>
              <summary>Click details</summary>
              <ul>
                {l.clicks.map((c, i) => (
                  <li key={i}>{new Date(c.timestamp).toLocaleString()} — {c.source} — {c.geo}</li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
