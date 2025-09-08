// src/utils/shortener.js

export function isValidUrl(s) {
  try {
    const url = new URL(s);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export function genShortcode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let res = "";
  for (let i = 0; i < length; i++) res += chars[Math.floor(Math.random() * chars.length)];
  return res;
}

export function loadLinks() {
  return JSON.parse(localStorage.getItem("shortlinks") || "[]");
}
export function saveLinks(list) {
  localStorage.setItem("shortlinks", JSON.stringify(list));
}

export function findUniqueShortcode(preferred, existingList) {
  const set = new Set(existingList.map(x => x.shortcode));
  if (preferred) {
    const cleaned = String(preferred).toLowerCase().trim();
    if (/^[a-z0-9-_]{3,20}$/.test(cleaned) && !set.has(cleaned)) return cleaned;
  }
  let s;
  do {
    s = genShortcode(5 + Math.floor(Math.random() * 2));
  } while (set.has(s));
  return s;
}

export function isExpired(item) {
  if (!item) return true;
  if (!item.expiresAt) return false;
  return Date.now() > item.expiresAt;
}
