const TOKEN_KEY = 'skillable_token';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function saveAuthToken(token, keepSignedIn) {
  if (!token) return;
  const primaryStorage = keepSignedIn ? localStorage : sessionStorage;
  const secondaryStorage = keepSignedIn ? sessionStorage : localStorage;

  secondaryStorage.removeItem(TOKEN_KEY);
  primaryStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}
