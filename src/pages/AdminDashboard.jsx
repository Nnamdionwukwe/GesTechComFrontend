// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Users,
  FileText,
  Mail,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Activity,
  UserPlus,
  Eye,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LineChart,
} from "lucide-react";
import styles from "./AdminDashboard.module.css";
import PaymentsManagement from "./PaymentsManagement";
import LeadsManagement from "../components/LeadsManagement";
import ProjectsManagement from "../components/admin/ProjectsManagement";
import ServicesManagement from "../components/admin/ServicesManagement";
import TestimonialsManagement from "../components/admin/TestimonialsManagement";
import TeamManagement from "../components/admin/TeamManagement";
import BlogManagement from "../components/admin/BlogManagement";
import SubscribersManagement from "../components/admin/SubscribersManagement";
import UsersManagement from "../components/admin/UsersManagement";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // On mobile, sidebar closed by default
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  // Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Stats
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    // Close sidebar on mobile after navigation
    if (isMobile) setSidebarOpen(false);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "team", label: "Team Members", icon: Users },
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "leads", label: "Leads", icon: Mail },
    { id: "subscribers", label: "Subscribers", icon: UserPlus },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className={styles.adminContainer}>
      {/* ── Sidebar ── */}
      <aside
        className={`${styles.adminSidebar} ${sidebarOpen ? styles.open : styles.closed}`}
      >
        {/* Sidebar header with logo + collapse toggle */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.logoIcon}>GT</div>
            </Link>
            <span className={styles.logoText}>GesTech Admin</span>
          </div>

          {/* Desktop collapse toggle lives inside the sidebar */}
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.sidebarNav}>
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              data-label={label}
              className={`${styles.navItem} ${activeTab === id ? styles.active : ""}`}
              onClick={() => handleNavClick(id)}
            >
              <Icon size={20} />
              <span className={styles.navLabel}>{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <button
            className={styles.navItem}
            data-label={darkMode ? "Light Mode" : "Dark Mode"}
            onClick={toggleTheme}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className={styles.navLabel}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
          <button
            className={styles.navItem}
            data-label="Logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className={styles.navLabel}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay — tap to close */}
      {isMobile && sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <main
        className={styles.adminMain}
        style={{ marginLeft: isMobile ? 0 : sidebarOpen ? "260px" : "70px" }}
      >
        {/* Header */}
        <header className={styles.adminHeader}>
          {/* Mobile hamburger */}
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <h1 className={styles.pageTitle}>
            {menuItems.find((m) => m.id === activeTab)?.label || "Dashboard"}
          </h1>

          <div className={styles.headerActions}>
            <button className={styles.iconButton} onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className={styles.adminContent}>
          {activeTab === "dashboard" && (
            <DashboardStats stats={stats} loading={loading} />
          )}
          {activeTab === "services" && <ServicesManagement />}
          {activeTab === "projects" && <ProjectsManagement />}
          {activeTab === "testimonials" && <TestimonialsManagement />}
          {activeTab === "team" && <TeamManagement />}
          {activeTab === "blog" && <BlogManagement />}
          {activeTab === "payments" && <PaymentsManagement />}
          {activeTab === "subscribers" && <SubscribersManagement />}
          {activeTab === "leads" && <LeadsManagement />}
          {activeTab === "users" && <UsersManagement />}
        </div>
      </main>
    </div>
  );
};

/* ── Dashboard Stats ── */
const DashboardStats = ({ stats, loading }) => {
  if (loading)
    return <div className={styles.loading}>Loading dashboard...</div>;
  if (!stats)
    return <div className={styles.error}>Failed to load dashboard stats</div>;

  const statCards = [
    {
      title: "Total Services",
      value: stats.services?.total || 0,
      icon: Briefcase,
      color: "#3498db",
      change: "+12%",
    },
    {
      title: "Projects",
      value: stats.projects?.total || 0,
      icon: FolderOpen,
      color: "#27ae60",
      change: "+8%",
    },
    {
      title: "New Leads",
      value: stats.leads?.new || 0,
      icon: TrendingUp,
      color: "#e74c3c",
      change: "+23%",
    },
    {
      title: "Subscribers",
      value: stats.subscribers?.total || 0,
      icon: UserPlus,
      color: "#ff6b35",
      change: "+15%",
    },
  ];

  return (
    <div className={styles.dashboardStats}>
      <div className={styles.statGrid}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Icon size={24} style={{ color: stat.color }} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>{stat.title}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  {stat.change} from last month
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardCard}>
          <h3 className={styles.cardTitle}>
            <Activity size={20} /> Recent Leads
          </h3>
          <div className={styles.leadList}>
            {stats.leads?.recent?.slice(0, 5).map((lead, i) => (
              <div key={i} className={styles.leadItem}>
                <div className={styles.leadInfo}>
                  <div className={styles.leadName}>{lead.full_name}</div>
                  <div className={styles.leadEmail}>{lead.email}</div>
                </div>
                <span
                  className={`${styles.badge} ${styles["badge" + lead.status.charAt(0).toUpperCase() + lead.status.slice(1)]}`}
                >
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.dashboardCard}>
          <h3 className={styles.cardTitle}>
            <Eye size={20} /> Leads by Status
          </h3>
          <div className={styles.statusList}>
            {stats.leads?.byStatus?.map((item, i) => (
              <div key={i} className={styles.statusItem}>
                <div className={styles.statusInfo}>
                  <span className={styles.statusLabel}>{item.status}</span>
                  <span className={styles.statusCount}>{item.count}</span>
                </div>
                <div className={styles.statusBar}>
                  <div
                    className={styles.statusFill}
                    style={{
                      width: `${(item.count / stats.leads.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.quickStats}>
        <div className={styles.quickStat}>
          <div className={styles.quickStatLabel}>Blog Posts</div>
          <div className={styles.quickStatValue}>
            {stats.blog?.published || 0} / {stats.blog?.total || 0}
          </div>
        </div>
        <div className={styles.quickStat}>
          <div className={styles.quickStatLabel}>Testimonials</div>
          <div className={styles.quickStatValue}>
            {stats.testimonials?.total || 0}
          </div>
        </div>
        <div className={styles.quickStat}>
          <div className={styles.quickStatLabel}>Total Leads</div>
          <div className={styles.quickStatValue}>{stats.leads?.total || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
