import React, { useState, useEffect } from "react";
import { submitBrandOnboarding, updateStoredUser } from "../lib/auth.js";
import { FiSearch, FiGlobe, FiMapPin, FiArrowLeft } from "react-icons/fi";

/* ── Magnifying-glass brand mark ── */
const BrandMark = () => (
  <div
    className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
    style={{
      background: "linear-gradient(140deg,#9b72ef,#6d3fc7)",
      boxShadow: "0 4px 14px rgba(109,63,199,0.4)",
    }}
  >
    <FiSearch size={15} color="white" strokeWidth={2.5} />
  </div>
);

/* ── 3-node connected step bar ── */
const StepBar = () => (
  <div className="flex items-center mt-3 mb-5">
    {[0, 1, 2].map((i) => (
      <React.Fragment key={i}>
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-500"
          style={{
            background: i === 0 ? "#9b72ef" : i === 1 ? "#fff" : "rgba(255,255,255,0.3)",
            border: i === 1 ? "2.5px solid #9b72ef" : "2px solid transparent",
            boxShadow: i === 1 ? "0 0 0 3px rgba(155,114,239,0.22)" : "none",
          }}
        />
        {i < 2 && (
          <div
            className="flex-1 h-0.5"
            style={{
              background:
                i === 0
                  ? "linear-gradient(90deg,#9b72ef,rgba(155,114,239,0.3))"
                  : "rgba(255,255,255,0.2)",
            }}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ── Sparkle icon ── */
const Sparkle = ({ style, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    style={{ position: "absolute", pointerEvents: "none", ...style }}
  >
    <path
      d="M8 1v3M8 12v3M1 8h3M12 8h3M3 3l2 2M11 11l2 2M13 3l-2 2M5 11l-2 2"
      stroke="rgba(255,255,255,0.65)"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Crystal gem ── */
const Crystal = ({ style, size = 52 }) => (
  <svg
    width={size}
    height={size * 1.32}
    viewBox="0 0 60 80"
    fill="none"
    style={{ position: "absolute", pointerEvents: "none", ...style }}
  >
    <polygon
      points="30,2 55,25 45,75 15,75 5,25"
      fill="rgba(255,255,255,0.15)"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1.2"
    />
    <polygon points="30,2 55,25 30,18" fill="rgba(255,255,255,0.22)" />
    <line
      x1="30" y1="2" x2="30" y2="75"
      stroke="rgba(255,255,255,0.18)"
      strokeWidth="0.8"
    />
  </svg>
);

/* ── Input field wrapper ── */
const InputField = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-[10.5px] font-bold tracking-widest uppercase"
      style={{ color: "#9b72ef" }}
    >
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center z-10">
          {icon}
        </span>
      )}
      {React.cloneElement(children, {
        className: [
          "w-full rounded-xl border text-sm font-medium outline-none transition-all duration-200",
          "bg-white/70 border-purple-200 text-[#1e0047] placeholder-purple-200",
          "focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white/90",
          icon ? "pl-8 pr-3 py-2.5" : "px-3 py-2.5",
          children.type === "textarea" ? "resize-y min-h-[78px]" : "",
        ]
          .filter(Boolean)
          .join(" "),
      })}
    </div>
  </div>
);

export default function BrandOnboarding({ onComplete, onBack }) {
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await submitBrandOnboarding(form);
      updateStoredUser(data.user);
      setMessage("Brand profile saved. Redirecting to dashboard...");
      setMessageType("success");
      setTimeout(() => onComplete?.(), 900);
    } catch (err) {
      setMessage(err.message || "Unable to save brand details");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      delay: "0.20s",
      node: (
        <InputField label="Brand Name">
          <input
            type="text"
            value={form.brandName}
            onChange={update("brandName")}
            placeholder="Acme Studios"
            required
          />
        </InputField>
      ),
    },
    {
      delay: "0.27s",
      node: (
        <InputField label="Brand Description">
          <textarea
            value={form.brandDescription}
            onChange={update("brandDescription")}
            placeholder="What does your brand do?"
            required
          />
        </InputField>
      ),
    },
    {
      delay: "0.34s",
      node: (
        <InputField
          label="Website"
          icon={<FiGlobe size={13} color="#c4b5fd" />}
        >
          <input
            type="url"
            value={form.brandWebsite}
            onChange={update("brandWebsite")}
            placeholder="https://example.com"
          />
        </InputField>
      ),
    },
    {
      delay: "0.41s",
      node: (
        <div className="grid grid-cols-2 gap-2.5">
          <InputField label="Industry">
            <input
              type="text"
              value={form.brandIndustry}
              onChange={update("brandIndustry")}
              placeholder="Consumer tech"
            />
          </InputField>
          <InputField
            label="Location"
            icon={<FiMapPin size={13} color="#c4b5fd" />}
          >
            <input
              type="text"
              value={form.brandLocation}
              onChange={update("brandLocation")}
              placeholder="San Francisco, CA"
            />
          </InputField>
        </div>
      ),
    },
  ];

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/onboarding.png')" }}
      />
      {/* Slight overlay for readability */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(90,40,160,0.15)" }}
      />

      {/* Swirling light rays */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 560 700"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-40 350 Q120 100 300 300 Q480 500 600 200"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="80"
          fill="none"
        />
        <path
          d="M0 500 Q200 300 400 450 Q520 550 580 350"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="55"
          fill="none"
        />
      </svg>

      {/* Crystals */}
      <Crystal style={{ top: "2%", left: "0.5%" }} size={58} />
      <Crystal style={{ bottom: "3%", left: "1.5%" }} size={44} />
      <Crystal style={{ top: "27%", right: 0, transform: "rotate(15deg)" }} size={54} />
      <Crystal style={{ bottom: "7%", right: "1.5%", transform: "rotate(-10deg)" }} size={36} />
      <Crystal style={{ top: "5%", right: "4%", transform: "rotate(20deg)" }} size={26} />

      {/* Sparkles */}
      <Sparkle style={{ top: "13%", left: "7%" }} size={18} />
      <Sparkle style={{ top: "21%", right: "11%" }} size={14} />
      <Sparkle style={{ bottom: "21%", left: "8%" }} size={14} />
      <Sparkle style={{ bottom: "6%", right: "9%" }} size={20} />
      <Sparkle style={{ top: "53%", left: "4%" }} size={10} />
      <Sparkle style={{ top: "5%", right: "19%" }} size={9} />

      {/* Hearts / stars */}
      {[
        { t: "43%", l: "2.5%", ch: "♡", op: 0.3, sz: 14 },
        { t: "17%", r: "2.5%", ch: "♡", op: 0.25, sz: 11 },
        { t: "27%", l: "3%", ch: "★", op: 0.22, sz: 14 },
        { b: "33%", r: "3%", ch: "★", op: 0.18, sz: 11 },
      ].map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: s.t,
            bottom: s.b,
            left: s.l,
            right: s.r,
            color: "white",
            opacity: s.op,
            fontSize: s.sz,
            pointerEvents: "none",
          }}
        >
          {s.ch}
        </span>
      ))}

      {/* Glow behind card */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          filter: "blur(28px)",
        }}
      />

      {/* ── Glassmorphism Card ── */}
      <div
        className="relative z-10 w-full max-w-[458px] rounded-2xl shadow-2xl p-7"
        style={{
          backdropFilter: "blur(22px) saturate(1.5)",
          WebkitBackdropFilter: "blur(22px) saturate(1.5)",
          background: "rgba(255,255,255,0.82)",
          border: "1px solid rgba(255,255,255,0.78)",
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "translateY(0) scale(1)"
            : "translateY(22px) scale(0.97)",
          transition:
            "opacity 0.52s cubic-bezier(0.4,0,0.2,1), transform 0.52s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BrandMark />
            <span className="text-sm font-bold" style={{ color: "#1e0047" }}>
              CreatorLens
            </span>
          </div>
          <button
            type="button"
            onClick={() => onBack?.()}
            className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors duration-150 hover:bg-purple-100"
            style={{
              color: "#6d3fc7",
              border: "1.5px solid #e0d0f8",
              background: "rgba(243,238,255,0.85)",
            }}
          >
            <FiArrowLeft size={12} />
            Back to Home
          </button>
        </div>

        <StepBar />

        {/* Heading */}
        <div
          className="mb-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.45s 0.12s, transform 0.45s 0.12s",
          }}
        >
          <h1 className="text-xl font-extrabold leading-tight" style={{ color: "#1a0040" }}>
            Tell us about your brand
          </h1>
          <p className="text-xs mt-1" style={{ color: "#8a7ab0" }}>
            Share a few details so we can personalize your dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {fields.map(({ delay, node }, i) => (
            <div
              key={i}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 0.45s ${delay}, transform 0.45s ${delay}`,
              }}
            >
              {node}
            </div>
          ))}

          {/* CTA button */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.45s 0.49s, transform 0.45s 0.49s",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-3 rounded-xl text-white text-sm font-bold tracking-wide
                transition-all duration-200 hover:scale-[1.025] hover:shadow-xl
                active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed
                disabled:hover:scale-100"
              style={{
                background: loading
                  ? "rgba(155,114,239,0.6)"
                  : "linear-gradient(135deg,#9b72ef 0%,#5b21b6 100%)",
                boxShadow: "0 5px 22px rgba(109,63,199,0.36)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="inline-block w-3.5 h-3.5 rounded-full border-2"
                    style={{
                      borderColor: "rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      animation: "cl-spin 0.7s linear infinite",
                    }}
                  />
                  Saving...
                </span>
              ) : (
                "Continue to Dashboard →"
              )}
            </button>
          </div>

          {message && (
            <p
              className="text-xs text-center mt-0.5"
              style={{
                color: messageType === "success" ? "#10b981" : "#ef4444",
                animation: "cl-fadein 0.3s ease forwards",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes cl-spin  { to { transform: rotate(360deg); } }
        @keyframes cl-fadein { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
