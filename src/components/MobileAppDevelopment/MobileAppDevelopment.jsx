import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Zap,
  Users,
  TrendingUp,
  Apple,
  Chrome,
  Layout,
  Cpu,
  Share2,
  Bell,
  Lock,
  ArrowRight,
  Play,
  ChevronRight,
  Download,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./MobileAppDevelopment.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const MobileAppDevelopment = () => {
  const [activePlatform, setActivePlatform] = useState("both");
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const [serviceRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/api/agency/services/mobile-app-development`),
        fetch(
          `${API_URL}/api/agency/portfolio?service=mobile-app-development&limit=4`,
        ),
      ]);

      const serviceData = await serviceRes.json();
      const projectsData = await projectsRes.json();

      setStats(serviceData.service);
      setProjects(projectsData.projects || []);
    } catch (error) {
      console.error("Failed to fetch service data:", error);
    }
  };

  const platforms = [
    {
      id: "both",
      name: "Cross-Platform",
      icon: "🚀",
      description: "One codebase for iOS & Android",
      tech: ["React Native", "Flutter", "Ionic"],
    },
    {
      id: "ios",
      name: "iOS Development",
      icon: "🍎",
      description: "Native iPhone & iPad apps",
      tech: ["Swift", "SwiftUI", "UIKit"],
    },
    {
      id: "android",
      name: "Android Development",
      icon: "🤖",
      description: "Native Android applications",
      tech: ["Kotlin", "Jetpack Compose", "Java"],
    },
  ];

  const features = [
    {
      icon: Layout,
      title: "Intuitive UI/UX",
      description: "Beautiful, user-friendly interfaces that delight users",
      color: "#FF6B9D",
    },
    {
      icon: Zap,
      title: "High Performance",
      description: "Lightning-fast apps optimized for mobile",
      color: "#FEC84B",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Enterprise-grade security protecting user data",
      color: "#0EA5E9",
    },
    {
      icon: Share2,
      title: "API Integration",
      description: "Seamless connection with your backend services",
      color: "#8B5CF6",
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Engage users with timely, relevant messages",
      color: "#F59E0B",
    },
    {
      icon: TrendingUp,
      title: "Analytics Ready",
      description: "Track user behavior and app performance",
      color: "#10B981",
    },
  ];

  const appTypes = [
    {
      title: "E-Commerce Apps",
      description: "Shopping experiences that drive conversions",
      icon: "🛍️",
      examples: ["Product catalogs", "Payment integration", "Order tracking"],
    },
    {
      title: "Social Media Apps",
      description: "Connect people and build communities",
      icon: "💬",
      examples: ["Real-time messaging", "Media sharing", "User profiles"],
    },
    {
      title: "On-Demand Services",
      description: "Uber-like apps for any service",
      icon: "🚗",
      examples: ["Booking systems", "Live tracking", "In-app payments"],
    },
    {
      title: "Health & Fitness",
      description: "Apps that promote wellness",
      icon: "💪",
      examples: ["Activity tracking", "Workout plans", "Health monitoring"],
    },
    {
      title: "Entertainment Apps",
      description: "Streaming and media platforms",
      icon: "🎬",
      examples: ["Video streaming", "Audio players", "Content libraries"],
    },
    {
      title: "Business Apps",
      description: "Enterprise and productivity tools",
      icon: "💼",
      examples: ["CRM systems", "Team collaboration", "Task management"],
    },
  ];

  const metrics = [
    { value: "500K+", label: "App Downloads" },
    { value: "4.8★", label: "Average Rating" },
    { value: "99.9%", label: "Uptime" },
    { value: "<2s", label: "Load Time" },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.floatingPhone}></div>
          <div className={styles.gradientMesh}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <Smartphone size={16} />
              <span>Mobile App Development</span>
            </div>

            <h1 className={styles.heroTitle}>
              Create Apps That
              <span className={styles.titleGradient}> Users Love</span>
            </h1>

            <p className={styles.heroDescription}>
              From concept to App Store launch, we build native and
              cross-platform mobile applications that deliver exceptional user
              experiences and drive real business results.
            </p>

            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryBtn}>
                Start Your App Project
                <ArrowRight size={20} />
              </Link>
              <button className={styles.secondaryBtn}>
                <Play size={20} />
                View Demo Apps
              </button>
            </div>

            {/* Metrics */}
            <div className={styles.metrics}>
              {metrics.map((metric, index) => (
                <div key={index} className={styles.metric}>
                  <div className={styles.metricValue}>{metric.value}</div>
                  <div className={styles.metricLabel}>{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneNotch}></div>
              <div className={styles.phoneScreen}>
                <div className={styles.appPreview}>
                  <div className={styles.appHeader}>
                    <div className={styles.appAvatar}></div>
                    <div className={styles.appTitle}>
                      <div className={styles.appTitleText}></div>
                      <div className={styles.appSubtitle}></div>
                    </div>
                  </div>
                  <div className={styles.appContent}>
                    {[1, 2, 3].map((item) => (
                      <div key={item} className={styles.appCard}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.phoneButton}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Selection */}
      <section className={styles.platformSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Choose Your Platform</h2>
            <p>We build for iOS, Android, or both with a single codebase</p>
          </div>

          <div className={styles.platformGrid}>
            {platforms.map((platform, index) => (
              <div
                key={platform.id}
                className={`${styles.platformCard} ${activePlatform === platform.id ? styles.active : ""}`}
                onClick={() => setActivePlatform(platform.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.platformIcon}>{platform.icon}</div>
                <h3>{platform.name}</h3>
                <p>{platform.description}</p>
                <div className={styles.techList}>
                  {platform.tech.map((tech, i) => (
                    <span key={i} className={styles.techBadge}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Powerful Features</h2>
            <p>Everything you need in a modern mobile app</p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={styles.featureCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={styles.featureIcon}
                  style={{ background: feature.color }}
                >
                  <feature.icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Types */}
      <section className={styles.appTypesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Apps We Build</h2>
            <p>Specialized expertise across multiple industries</p>
          </div>

          <div className={styles.appTypesGrid}>
            {appTypes.map((type, index) => (
              <div
                key={index}
                className={styles.appTypeCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.appTypeIcon}>{type.icon}</div>
                <h3>{type.title}</h3>
                <p>{type.description}</p>
                <ul className={styles.examplesList}>
                  {type.examples.map((example, i) => (
                    <li key={i}>
                      <ChevronRight size={16} />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {projects.length > 0 && (
        <section className={styles.portfolioSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Our Mobile Apps</h2>
              <p>Real apps we've built for real clients</p>
            </div>

            <div className={styles.portfolioGrid}>
              {projects.map((project, index) => (
                <Link
                  key={index}
                  to={`/portfolio/${project.slug}`}
                  className={styles.portfolioCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.portfolioImage}>
                    <img src={project.thumbnail} alt={project.title} />
                    <div className={styles.portfolioOverlay}>
                      <Download size={32} />
                    </div>
                  </div>
                  <div className={styles.portfolioInfo}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className={styles.portfolioMeta}>
                      <div className={styles.rating}>
                        <Star size={16} fill="currentColor" />
                        <span>4.8</span>
                      </div>
                      <div className={styles.downloads}>
                        <Download size={16} />
                        <span>50K+</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaPhone}>📱</div>
          <h2>Ready to Launch Your App?</h2>
          <p>Let's turn your idea into a top-rated mobile application</p>
          <Link to="/contact" className={styles.ctaButton}>
            Get Started Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MobileAppDevelopment;
