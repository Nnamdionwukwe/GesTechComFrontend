// src/pages/Register.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import styles from "./Register.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// ─── helpers ────────────────────────────────────────────────────────────────

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#e74c3c" };
  if (score <= 2) return { score, label: "Fair", color: "#f39c12" };
  if (score <= 3) return { score, label: "Good", color: "#3498db" };
  return { score, label: "Strong", color: "#27ae60" };
};

const PasswordRule = ({ met, text }) => (
  <div className={`${styles.rule} ${met ? styles.ruleMet : styles.ruleUnmet}`}>
    {met ? <CheckCircle size={13} /> : <XCircle size={13} />}
    <span>{text}</span>
  </div>
);

// ─── save tokens (works for both login shapes) ───────────────────────────────
//   email/password → { token, user }
//   Google         → { tokens: { accessToken, refreshToken }, user }
function saveAuth(data) {
  const token = data.token || data.tokens?.accessToken;
  const refresh = data.tokens?.refreshToken;
  if (token) localStorage.setItem("token", token);
  if (token) localStorage.setItem("accessToken", token);
  if (refresh) localStorage.setItem("refreshToken", refresh);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
}

// ─── Google Sign-In button ───────────────────────────────────────────────────
function GoogleSignInButton({ onSuccess, onError }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const init = () => {
      if (!window.google?.accounts?.id || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signup_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: containerRef.current.offsetWidth || 340,
      });
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const existing = document.getElementById("gsi-script");
      if (!existing) {
        const s = document.createElement("script");
        s.id = "gsi-script";
        s.src = "https://accounts.google.com/gsi/client";
        s.async = true;
        s.defer = true;
        s.onload = init;
        document.head.appendChild(s);
      } else {
        existing.addEventListener("load", init, { once: true });
      }
    }
  }, []);

  const handleCredential = async ({ credential }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
      });
      const data = await res.json();
      if (data.success) onSuccess(data);
      else onError(data.error || "Google sign-in failed");
    } catch {
      onError("Connection error during Google sign-in");
    }
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return <div ref={containerRef} className={styles.googleBtn} />;
}

// ─── Register ────────────────────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [touched, setTouched] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      navigate(user?.role === "admin" ? "/admin" : "/", { replace: true });
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const strength = getPasswordStrength(form.password);
  const rules = [
    { met: form.password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(form.password), text: "One uppercase letter" },
    { met: /[0-9]/.test(form.password), text: "One number" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const validate = () => {
    if (!form.full_name.trim()) return "Full name is required";
    if (form.full_name.trim().length < 2)
      return "Name must be at least 2 characters";
    if (!form.email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email";
    if (!form.password) return "Password is required";
    if (form.password.length < 8)
      return "Password must be at least 8 characters";
    if (form.password !== form.confirm_password)
      return "Passwords do not match";
    return null;
  };

  // Email/password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      full_name: true,
      email: true,
      password: true,
      confirm_password: true,
    });
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        saveAuth(data);
        setSubmitted(true);
        setTimeout(
          () =>
            navigate(data.user?.role === "admin" ? "/admin" : "/", {
              replace: true,
            }),
          1500,
        );
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google callback
  const handleGoogleSuccess = (data) => {
    setGoogleBusy(true);
    saveAuth(data);
    navigate(data.user?.role === "admin" ? "/admin" : "/", { replace: true });
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={48} />
          </div>
          <h2>You're in!</h2>
          <p>Account created successfully. Redirecting you now…</p>
        </div>
        <Blobs />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoMark}>GTC</div>
          </Link>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>
            Join GesTechCom and start your journey
          </p>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className={styles.errorBanner}>
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Google Sign-In ── */}
        <div className={styles.socialSection}>
          {googleBusy ? (
            <div className={styles.googleLoading}>
              <span className={styles.spinner} />
              Signing you in…
            </div>
          ) : (
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={(msg) => setError(msg)}
            />
          )}
        </div>

        {/* ── Divider ── */}
        {GOOGLE_CLIENT_ID && (
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or register with email</span>
            <span className={styles.dividerLine} />
          </div>
        )}

        {/* ── Email / password form ── */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Full Name */}
          <div
            className={`${styles.field} ${touched.full_name && !form.full_name ? styles.fieldError : ""}`}
          >
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrap}>
              <User size={18} className={styles.inputIcon} />
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                className={styles.input}
                autoComplete="name"
              />
            </div>
            {touched.full_name && !form.full_name && (
              <span className={styles.fieldMsg}>Full name is required</span>
            )}
          </div>

          {/* Email */}
          <div
            className={`${styles.field} ${touched.email && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? styles.fieldError : ""}`}
          >
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrap}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={styles.input}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a strong password"
                className={styles.input}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.password && (
              <div className={styles.strengthWrap}>
                <div className={styles.strengthBar}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={styles.strengthSegment}
                      style={{
                        background:
                          i <= strength.score ? strength.color : undefined,
                        opacity: i <= strength.score ? 1 : 0.2,
                      }}
                    />
                  ))}
                </div>
                <span
                  className={styles.strengthLabel}
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
            )}
            {touched.password && form.password && (
              <div className={styles.rules}>
                {rules.map((r, i) => (
                  <PasswordRule key={i} met={r.met} text={r.text} />
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div
            className={`${styles.field} ${touched.confirm_password && form.confirm_password && form.password !== form.confirm_password ? styles.fieldError : ""}`}
          >
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repeat your password"
                className={styles.input}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.confirm_password &&
              form.confirm_password &&
              form.password !== form.confirm_password && (
                <span className={styles.fieldMsg}>Passwords do not match</span>
              )}
            {touched.confirm_password &&
              form.confirm_password &&
              form.password === form.confirm_password && (
                <span className={styles.fieldMsgOk}>
                  <CheckCircle size={13} /> Passwords match
                </span>
              )}
          </div>

          <p className={styles.terms}>
            By creating an account, you agree to our{" "}
            <Link to="/terms" className={styles.link}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
            .
          </p>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <Sparkles size={18} /> Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Blobs />
    </div>
  );
};

const Blobs = () => (
  <div className={styles.blobs} aria-hidden>
    <div className={`${styles.blob} ${styles.blob1}`} />
    <div className={`${styles.blob} ${styles.blob2}`} />
    <div className={`${styles.blob} ${styles.blob3}`} />
  </div>
);

export default Register;
