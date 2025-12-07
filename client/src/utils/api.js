export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(path, { ...options, headers });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.message || "Request failed");
    return body;
}
