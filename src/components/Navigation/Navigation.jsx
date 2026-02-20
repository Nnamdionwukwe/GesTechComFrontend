import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav entirely on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Sync auth state on every route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(stored);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    navigate("/login");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navItems = [
    {
      label: "Services",
      dropdown: [
        {
          path: "/services/custom-software-development",
          label: "Software Development",
        },
        { path: "/services/mobile-app-development", label: "Mobile Apps" },
        { path: "/services/web-development", label: "Web Development" },
        { path: "/services/ui-ux-design", label: "UI/UX Design" },
        { path: "/services/social-media-management", label: "Social Media" },
        { path: "/services/digital-marketing", label: "Digital Marketing" },
      ],
    },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/about", label: "About" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
    { path: "/orders", label: "Orders" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>GTC</div>
          <span className={styles.logoText}>GesTechCom</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navItems.map((item, index) => (
              <li
                key={index}
                className={styles.navItem}
                onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <div className={styles.dropdownTrigger}>
                    <span className={styles.navLink}>
                      {item.label}
                      <ChevronDown size={16} className={styles.dropdownIcon} />
                    </span>
                    {activeDropdown === index && (
                      <div className={styles.dropdown}>
                        {item.dropdown.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={styles.dropdownItem}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`${styles.navLink} ${isActive(item.path) ? styles.active : ""}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Auth — admin dashboard link or login */}
            {user ? (
              <div className={styles.authGroup}>
                {user.role === "admin" || user.role === "editor" ? (
                  <Link to="/admin" className={styles.dashboardBtn}>
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                ) : null}
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className={styles.ctaButton}>
                Login
              </Link>
            )}

            <Link to="/contact" className={styles.ctaButton}>
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className={styles.mobileActions}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={styles.menuButton}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
        <ul className={styles.mobileNavList}>
          {navItems.map((item, index) => (
            <li key={index} className={styles.mobileNavItem}>
              {item.dropdown ? (
                <div>
                  <button
                    className={styles.mobileDropdownTrigger}
                    onClick={() =>
                      setActiveDropdown(activeDropdown === index ? null : index)
                    }
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`${styles.mobileDropdownIcon} ${activeDropdown === index ? styles.open : ""}`}
                    />
                  </button>
                  {activeDropdown === index && (
                    <ul className={styles.mobileDropdown}>
                      {item.dropdown.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
                            className={styles.mobileDropdownItem}
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`${styles.mobileNavLink} ${isActive(item.path) ? styles.active : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}

          {/* Mobile auth items */}
          {user ? (
            <>
              {(user.role === "admin" || user.role === "editor") && (
                <li className={styles.mobileNavItem}>
                  <Link
                    to="/admin"
                    className={styles.mobileNavLink}
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard
                      size={16}
                      style={{ marginRight: "0.5rem" }}
                    />
                    Dashboard
                  </Link>
                </li>
              )}
              <li className={styles.mobileNavItem}>
                <button
                  className={styles.mobileLogoutBtn}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className={styles.mobileNavItem}>
              <Link
                to="/login"
                className={styles.mobileNavLink}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        <Link
          to="/contact"
          className={styles.mobileCTA}
          onClick={() => setIsOpen(false)}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
