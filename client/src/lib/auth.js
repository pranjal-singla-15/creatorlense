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
