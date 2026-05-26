const ADMIN_SESSION_KEY = 'vita-energy-admin-auth-v1';
const DEFAULT_ADMIN_PASSWORD = 'vitaenergy2026';

function getAdminPassword(): string {
  return import.meta.env.VITE_ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function isAdminAuthenticated(): boolean {
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  } catch {
    return false;
  }
}

export function authenticateAdmin(password: string): boolean {
  const isValid = password.trim() === getAdminPassword();

  if (isValid) {
    try {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
    } catch {
      return false;
    }
  }

  return isValid;
}

export function clearAdminSession(): void {
  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // Ignore browsers that block session storage.
  }
}
