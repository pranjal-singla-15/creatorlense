import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function submitAuthRequest({ mode, name, email, password }) {
  const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
  const payload =
    mode === "register"
      ? { name, email, password }
      : { email, password };

  const { data } = await axios.post(`${API_BASE}${endpoint}`, payload);
  return data;
}

export function persistAuthSession(data) {
  if (typeof window === "undefined") {
    return;
  }

  const session = {
    token: data?.token ?? null,
    user: data?.user ?? {
      id: data?.id,
      name: data?.name,
      email: data?.email,
    },
  };

  window.localStorage.setItem("creatorlens_auth", JSON.stringify(session));
}
