import React, { useState } from "react";
import { persistAuthSession, submitAuthRequest } from "../lib/auth.js";

// Import your illustration — place sign_up.png in your public/ or assets/ folder
// and update this path accordingly
const signUpIllustration = "/sigin_page.png";

const AUTH_MODES = {
  login: {
    title: "Sign In",
    switchText: "Don't have an account?",
    switchAction: "Sign Up",
    switchMode: "register",
    submitLabel: "Sign In",
    successMessage: "Signed in successfully.",
  },
  register: {
    title: "Create Account",
    switchText: "Already have an account?",
    switchAction: "Sign In",
    switchMode: "login",
    submitLabel: "Create Account",
    successMessage: "Account created successfully.",
  },
};

// HubSpot logo SVG
const HubSpotLogo = () => (
  <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#FF7A59" />
    <path d="M23 13v4.3a3 3 0 1 0 2 0V13h-2zm1 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM15 20a5 5 0 1 0 8.66 2.5l-3.66-2.11V15a5 5 0 0 0-5 5zm5 3a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="white"/>
  </svg>
);

// Spotify logo SVG
const SpotifyLogo = () => (
  <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#1DB954" />
    <path d="M28 24.5c-.3 0-.5-.1-.7-.2-3.3-2-7.4-2.4-12.3-1.3-.5.1-1-.2-1.1-.7-.1-.5.2-1 .7-1.1 5.3-1.2 9.9-.7 13.6 1.5.4.3.6.8.3 1.3-.2.3-.3.5-.5.5zm1.5-3.5c-.3 0-.6-.1-.8-.3-3.8-2.3-9.5-3-13.9-1.6-.6.2-1.2-.1-1.4-.7-.2-.6.1-1.2.7-1.4 5-1.6 11.3-.8 15.6 1.8.5.3.7.9.4 1.4-.2.5-.4.8-.6.8zm.1-3.5c-.3 0-.5-.1-.7-.2-4.3-2.6-11.3-2.8-15.4-1.5-.7.2-1.4-.2-1.6-.8-.2-.7.2-1.4.8-1.6 4.7-1.4 12.4-1.2 17.3 1.7.6.3.8 1 .5 1.6-.3.5-.6.8-.9.8z" fill="white"/>
  </svg>
);

// Salesforce logo SVG
const SalesforceLogo = () => (
  <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#00A1E0" />
    <path d="M17 14c1.1 0 2 .4 2.7 1.1.6-.7 1.5-1.1 2.5-1.1 1.9 0 3.4 1.5 3.4 3.4 0 .2 0 .4-.1.6.3-.1.7-.2 1-.2 1.7 0 3 1.4 3 3s-1.3 3-3 3H14c-1.7 0-3-1.4-3-3 0-1.5 1.1-2.8 2.6-3-.1-.3-.1-.6-.1-.8C13.5 15.5 15.1 14 17 14z" fill="white"/>
  </svg>
);

// Shopify logo SVG
const ShopifyLogo = () => (
  <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#96BF48" />
    <path d="M26.5 13.5c0-.1-.1-.2-.2-.2-.1 0-2.1-.2-2.1-.2s-1.4-1.4-1.5-1.5c-.1-.1-.4-.1-.5 0l-.7.2C21 11 20.4 10 19.5 10c-.1 0-.2 0-.3.1-.3-.4-.6-.5-1-.5-2.4 0-3.6 3-4 4.6l-1.7.5c-.5.2-.5.2-.6.7L11 27l11.5 2L28 27l-1.5-13.5zM22 12.5l-1 .3V12c0-.5-.1-.9-.2-1.2.5.1.9.7 1.2 1.7zm-2.5-1.8c.2.3.3.7.3 1.4v.2l-2.2.7c.4-1.7 1.2-2.5 1.9-2.3zm-1-1c.1 0 .2 0 .3.1-1 .5-2.1 1.7-2.5 4.2l-1.9.6c.5-1.8 1.7-4.9 4.1-4.9z" fill="white"/>
  </svg>
);

// Brand logo mark
const BrandMark = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" rx="4" fill="url(#brandGrad)"/>
    <defs>
      <linearGradient id="brandGrad" x1="0" y1="0" x2="16" y2="16">
        <stop offset="0%" stopColor="#a78bfa"/>
        <stop offset="100%" stopColor="#7c3aed"/>
      </linearGradient>
    </defs>
    <path d="M8 3l1.6 3.2H13l-2.7 2 1 3.1L8 9.4 4.7 11.3l1-3.1L3 6.2h3.4z" fill="white"/>
  </svg>
);

export default function SignIn({ onBack }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const isRegister = mode === "register";
  const authMode = AUTH_MODES[mode];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await submitAuthRequest({ mode, name, email, password });
      persistAuthSession(data);
      setMessage(authMode.successMessage);
      setMessageType("success");
      window.setTimeout(() => onBack?.(), 800);
    } catch (error) {
      setMessage(error.message || "Something went wrong");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(authMode.switchMode);
    setMessage("");
  };

  return (
    <div style={styles.page}>
      {/* Page label */}
      <p style={styles.pageLabel}>Sign In Page</p>

      {/* Card */}
      <div style={styles.card}>
        {/* ── LEFT PANEL ── */}
        <div style={styles.leftPanel}>
          {/* Your illustration image fills the entire left panel */}
          <img
            src={signUpIllustration}
            alt="Creator illustration"
            style={styles.illustration}
          />
          {/* Brand overlay top-left */}
          <div style={styles.brandOverlay}>
            <BrandMark size={18} />
            <span style={styles.brandOverlayText}>CreatorLens</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={styles.rightPanel}>
          {/* Brand top of form */}
          <div style={styles.brandRow}>
            <BrandMark size={18} />
            <span style={styles.brandText}>CreatorLens</span>
          </div>

          {/* Heading */}
          <h1 style={styles.heading}>{authMode.title}</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Name — register only */}
            {isRegister && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>
            )}

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Remember me + Forgot password */}
            <div style={styles.optionsRow}>
              <label style={styles.rememberLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                Remember me
              </label>
              <button type="button" style={styles.forgotBtn}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {}),
              }}
            >
              {loading ? "Please wait..." : authMode.submitLabel}
            </button>

            {/* Message */}
            {message && (
              <p style={{
                ...styles.message,
                color: messageType === "success" ? "#10b981" : "#ef4444",
              }}>
                {message}
              </p>
            )}

            {/* Switch mode */}
            <p style={styles.switchRow}>
              {authMode.switchText}{" "}
              <button type="button" onClick={switchMode} style={styles.switchBtn}>
                {authMode.switchAction}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* ── BOTTOM LOGOS ── */}
      <div style={styles.bottomLogos}>
        <div style={styles.logoItem}>
          <HubSpotLogo />
          <span style={{ ...styles.logoName, color: "#FF7A59" }}>HubSpot</span>
        </div>
        <div style={styles.logoItem}>
          <SpotifyLogo />
          <span style={{ ...styles.logoName, color: "#1DB954" }}>Spotify</span>
        </div>
        <div style={styles.logoItem}>
          <SalesforceLogo />
          <span style={{ ...styles.logoName, color: "#00A1E0" }}>Salesforce</span>
        </div>
        <div style={styles.logoItem}>
          <ShopifyLogo />
          <span style={{ ...styles.logoName, color: "#96BF48" }}>Shopify</span>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(145deg, #dcd4f5 0%, #ebe5fb 40%, #e0d8f8 70%, #d5cdf2 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px 48px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  pageLabel: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#6e5fa0",
    marginBottom: "14px",
    letterSpacing: "0.1px",
  },

  card: {
    width: "100%",
    maxWidth: "680px",
    background: "white",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 8px 48px rgba(100,70,190,0.14), 0 2px 12px rgba(100,70,190,0.07)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },

  // ── Left panel ──
  leftPanel: {
    position: "relative",
    minHeight: "400px",
    overflow: "hidden",
    background: "linear-gradient(145deg, #ece6fb, #d8d0f0)",
  },

  illustration: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "left center",
  },

  brandOverlay: {
    position: "absolute",
    top: "16px",
    left: "16px",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  brandOverlayText: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#5b3ea6",
  },

  // ── Right panel ──
  rightPanel: {
    padding: "32px 32px 28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "18px",
  },

  brandText: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#5b3ea6",
  },

  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "16px",
    letterSpacing: "-0.3px",
    lineHeight: 1.2,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginBottom: "12px",
  },

  label: {
    fontSize: "11.5px",
    fontWeight: "500",
    color: "#4a4a6a",
  },

  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e5e0f5",
    borderRadius: "9px",
    background: "#f9f8fd",
    fontSize: "13px",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#1a1a2e",
    outline: "none",
    transition: "border-color 0.18s, box-shadow 0.18s",
    boxSizing: "border-box",
  },

  inputFocus: {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #8b5cf6",
    borderRadius: "9px",
    background: "#ffffff",
    fontSize: "13px",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#1a1a2e",
    outline: "none",
    boxShadow: "0 0 0 3px rgba(139,92,246,0.1)",
    boxSizing: "border-box",
  },

  optionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
    marginTop: "2px",
  },

  rememberLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11.5px",
    color: "#6b6b8a",
    cursor: "pointer",
  },

  checkbox: {
    accentColor: "#8b5cf6",
    width: "13px",
    height: "13px",
    cursor: "pointer",
  },

  forgotBtn: {
    background: "none",
    border: "none",
    fontSize: "11.5px",
    color: "#6b6b8a",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
  },

  submitBtn: {
    width: "100%",
    padding: "11px",
    background: "linear-gradient(135deg, #9b72ef 0%, #6d3fc7 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "inherit",
    cursor: "pointer",
    boxShadow: "0 4px 18px rgba(109,63,199,0.32)",
    letterSpacing: "0.1px",
    transition: "opacity 0.15s, transform 0.15s",
  },

  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  message: {
    fontSize: "12px",
    textAlign: "center",
    marginTop: "8px",
  },

  switchRow: {
    fontSize: "11.5px",
    color: "#8a8aaa",
    textAlign: "center",
    marginTop: "14px",
  },

  switchBtn: {
    background: "none",
    border: "none",
    color: "#7c3aed",
    fontWeight: "600",
    fontSize: "11.5px",
    fontFamily: "inherit",
    cursor: "pointer",
    padding: 0,
  },

  // ── Bottom logos ──
  bottomLogos: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  logoItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    opacity: 0.65,
    cursor: "pointer",
  },

  logoName: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.1px",
  },
};

