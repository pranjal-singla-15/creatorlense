export const AUTH_STORAGE_KEYS = {
  token: "creatorlens_token",
  user: "creatorlens_user",
};

export async function submitAuthRequest({ mode, name, email, password }) {
  const endpoint =
    mode === "register" ? "/api/auth/register" : "/api/auth/login";

  const payload =
    mode === "register"
      ? { name, email, password }
      : { email, password };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  return data;
}

export function persistAuthSession({ token, user }) {
  localStorage.setItem(AUTH_STORAGE_KEYS.token, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
}

export function readAuthSession() {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
  const userRaw = localStorage.getItem(AUTH_STORAGE_KEYS.user);
  let user = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch (_error) {
      user = null;
    }
  }

  return { token, user };
}

export function updateStoredUser(user) {
  if (!user) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
}

export async function submitBrandOnboarding(details) {
  const { token } = readAuthSession();

  const response = await fetch("/api/auth/onboarding", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(details),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save brand details");
  }

  return data;
}
