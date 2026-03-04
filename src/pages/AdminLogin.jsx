// src/pages/AdminLogin.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Sun, Moon } from "lucide-react";
import styles from "./AdminLogin.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function saveAuth(data) {
  const token = data.token || data.tokens?.accessToken;
  const refresh = data.tokens?.refreshToken;
  if (token) localStorage.setItem("token", token);
  if (token) localStorage.setItem("accessToken", token);
  if (refresh) localStorage.setItem("refreshToken", refresh);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
}

// ── Google Sign-In button ─────────────────────────────────────────────────────
function GoogleSignInButton({ onSuccess, onError }) {
  const containerRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    // handleCredential defined inside useEffect — no hoisting/ordering issue
    const handleCredential = async ({ credential }) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/google/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: credential }),
        });
        const data = await res.json();
        if (data.success) onSuccessRef.current(data);
        else onErrorRef.current(data.error || "Google sign-in failed");
      } catch {
        onErrorRef.current("Connection error during Google sign-in");
      }
    };

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
        text: "signin_with",
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

  if (!GOOGLE_CLIENT_ID) return null;
  return <div ref={containerRef} className={styles.googleBtn} />;
}

// ── AdminLogin ────────────────────────────────────────────────────────────────
const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

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

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        saveAuth(data);
        const role = data.user?.role;
        navigate(["admin", "editor"].includes(role) ? "/admin" : "/", {
          replace: true,
        });
      } else {
        setError(data.error || "Login failed. Check your credentials.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
    setGoogleBusy(true);
    saveAuth(data);
    const role = data.user?.role;
    navigate(["admin", "editor"].includes(role) ? "/admin" : "/", {
      replace: true,
    });
  };

  return (
    <div className={styles.loginContainer}>
      <button
        className={styles.themeToggleBtn}
        onClick={toggleTheme}
        title="Toggle theme"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <div className={styles.loginLogoIcon}>GTC</div>
          </div>
          <h1 className={styles.loginTitle}>Welcome back</h1>
          <p className={styles.loginSubtitle}>
            Sign in to access the dashboard
          </p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {GOOGLE_CLIENT_ID && (
          <>
            <div className={styles.socialSection}>
              {googleBusy ? (
                <div className={styles.googleLoading}>
                  <span className={styles.spinner} /> Signing you in…
                </div>
              ) : (
                <GoogleSignInButton
                  onSuccess={handleGoogleSuccess}
                  onError={(msg) => setError(msg)}
                />
              )}
            </div>
            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>or sign in with email</span>
              <span className={styles.dividerLine} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={20} className={styles.inputIcon} />
              <input
                type="email"
                className={styles.formInput}
                placeholder="admin@gestech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                className={styles.formInput}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? <span className={styles.spinner} /> : "Sign In"}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.footerLink}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.loginBackground}>
        <div className={`${styles.backgroundShape} ${styles.shape1}`} />
        <div className={`${styles.backgroundShape} ${styles.shape2}`} />
        <div className={`${styles.backgroundShape} ${styles.shape3}`} />
      </div>
    </div>
  );
};

export default AdminLogin;
