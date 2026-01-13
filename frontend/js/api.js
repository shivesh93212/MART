const BASE_URL = "http://127.0.0.1:8000";

async function apiFetch(url, options = {}) {
  const res = await fetch(BASE_URL + url, options);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}
