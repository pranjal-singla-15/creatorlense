import React, { useState } from "react";
import { submitBrandOnboarding, updateStoredUser } from "../lib/auth.js";
import { FiSearch } from "react-icons/fi";

const BrandMark = ({ iconSize = 20 }) => (
  <div style={styles.brandMark}>
    <FiSearch size={iconSize} className="text-white" />
  </div>
);

export default function BrandOnboarding({ onComplete }) {
  const [form, setForm] = useState({
    brandName: "",
    brandDescription: "",
    brandWebsite: "",
    brandIndustry: "",
    brandLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await submitBrandOnboarding(form);
      updateStoredUser(data.user);
      setMessage("Brand profile saved. Redirecting to dashboard...");
      setMessageType("success");
      window.setTimeout(() => onComplete?.(), 900);
    } catch (error) {
      setMessage(error.message || "Unable to save brand details");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <BrandMark />
          <div>
            <p style={styles.brandLabel}>CreatorLens</p>
            <h1 style={styles.heading}>Tell us about your brand</h1>
            <p style={styles.subheading}>
              Share a few details so we can personalize your dashboard.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Brand name</label>
            <input
              type="text"
              value={form.brandName}
              onChange={update("brandName")}
              placeholder="Acme Studios"
              required
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Brand description</label>
            <textarea
              value={form.brandDescription}
              onChange={update("brandDescription")}
              placeholder="What does your brand do?"
              rows={4}
              required
              style={{ ...styles.input, ...styles.textarea }}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Website</label>
            <input
              type="url"
              value={form.brandWebsite}
              onChange={update("brandWebsite")}
              placeholder="https://example.com"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Industry</label>
              <input
                type="text"
                value={form.brandIndustry}
                onChange={update("brandIndustry")}
                placeholder="Consumer tech"
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                value={form.brandLocation}
                onChange={update("brandLocation")}
                placeholder="San Francisco, CA"
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? "Saving..." : "Continue to dashboard"}
          </button>

          {message && (
            <p
              style={{
                ...styles.message,
                color: messageType === "success" ? "#10b981" : "#ef4444",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    background:
      "linear-gradient(145deg, #dcd4f5 0%, #ebe5fb 40%, #e0d8f8 70%, #d5cdf2 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "640px",
    background: "white",
    borderRadius: "18px",
    padding: "32px",
    boxShadow: "0 8px 48px rgba(100,70,190,0.14), 0 2px 12px rgba(100,70,190,0.07)",
  },
  header: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  brandMark: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #9b72ef 0%, #6d3fc7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 8px 20px rgba(109,63,199,0.3)",
  },
  brandLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#7c3aed",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: 0,
  },
  subheading: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#6e5fa0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  row: {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#4a4a6a",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
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
  textarea: {
    resize: "vertical",
    minHeight: "110px",
  },
  inputFocus: {
    width: "100%",
    padding: "10px 12px",
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
  submitBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
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
};

