// src/utils/loggingClient.js
export async function Log(stack, level, pkg, message) {
  const url = process.env.REACT_APP_LOG_API_URL;
  const token = process.env.REACT_APP_LOG_API_TOKEN;

  if (!url || !token) throw new Error("Missing logging API config");

  const s = String(stack).toLowerCase();
  const l = String(level).toLowerCase();
  const p = String(pkg).toLowerCase();

  const body = { stack: s, level: l, package: p, message: String(message) };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    throw new Error(`Log API error ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}
