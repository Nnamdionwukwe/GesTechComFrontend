// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
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

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  // Redirect if already logged in — skip register page
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      full_name: true,
      email: true,
      password: true,
      confirm_password: true,
    });
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSubmitted(true);
        // Role-aware redirect after success
        setTimeout(() => {
          navigate(data.user?.role === "admin" ? "/admin" : "/", {
            replace: true,
          });
        }, 1500);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
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
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoMark}>GTC</div>
          </Link>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>
            Join GesTechCom and start your journey
          </p>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}

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
                <Sparkles size={18} />
                Create Account
                <ArrowRight size={18} />
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
