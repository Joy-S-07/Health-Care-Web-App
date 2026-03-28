// ─── Auth Utilities (Session-based) ─────────
const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Make an API request with session cookies
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // send session cookies
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

/**
 * Check if user is authenticated (server-side session check)
 */
export async function checkAuth() {
  try {
    const data = await apiFetch('/auth/check');
    return data.authenticated;
  } catch {
    return false;
  }
}

/**
 * Set local auth flag (for instant UI updates)
 */
export function setLocalAuth(value) {
  localStorage.setItem('isAuthenticated', value ? 'true' : 'false');
  window.dispatchEvent(new Event('auth-change'));
}

/**
 * Quick local check (UI only, not authoritative)
 */
export function isLoggedIn() {
  return localStorage.getItem('isAuthenticated') === 'true';
}

/**
 * Logout: destroy server session + clear local state
 */
export async function logout() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
    // ignore errors during logout
  }
  localStorage.removeItem('isAuthenticated');
  window.dispatchEvent(new Event('auth-change'));
}

export { API_BASE_URL };
