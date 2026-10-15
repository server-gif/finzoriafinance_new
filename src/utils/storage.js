// Safe localStorage helpers (ported verbatim from home.html inline script).
export function safeGetItem(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}

export function safeSetItem(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}
