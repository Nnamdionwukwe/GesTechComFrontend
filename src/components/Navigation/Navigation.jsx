import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navItems = [
    { path: "/", label: "Home" },
    {
      label: "Services",
      dropdown: [
        {
          path: "/services/software-development",
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
    { path: "/login", label: "Login" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>GT</div>
          <span className={styles.logoText}>GesTech</span>
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
