// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Sun, Moon } from "lucide-react";
import styles from "./AdminLogin.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Redirect if already logged in — skip login page for logged-in users
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Use navigate for SPA routing — no full page reload
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

  return (
    <div className={styles.loginContainer}>
      {/* Theme toggle */}
      <button
        className={styles.themeToggleBtn}
        onClick={toggleTheme}
        title="Toggle theme"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <div className={styles.loginLogoIcon}>GTC</div>
          </div>
          <h1 className={styles.loginTitle}>Welcome back</h1>
          <p className={styles.loginSubtitle}>
            Sign in to access the dashboard
          </p>
        </div>

        {/* Error */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Form */}
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

        {/* Footer — link to Register */}
        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.footerLink}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Background shapes */}
      <div className={styles.loginBackground}>
        <div className={`${styles.backgroundShape} ${styles.shape1}`} />
        <div className={`${styles.backgroundShape} ${styles.shape2}`} />
        <div className={`${styles.backgroundShape} ${styles.shape3}`} />
      </div>
    </div>
  );
};

export default AdminLogin;
