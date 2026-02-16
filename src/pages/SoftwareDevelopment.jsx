import React, { useState, useEffect } from "react";
import {
  Code,
  Zap,
  Shield,
  Layers,
  GitBranch,
  Cloud,
  Database,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Play,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./SoftwareDevelopment.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const SoftwareDevelopment = () => {
  const [activeTab, setActiveTab] = useState("web");
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch service data
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const [serviceRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/api/agency/services/software-development`),
        fetch(
          `${API_URL}/api/agency/portfolio?service=software-development&limit=3`,
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

  const technologies = {
    web: [
      { name: "React", icon: "⚛️", color: "#61DAFB" },
      { name: "Node.js", icon: "🟢", color: "#339933" },
      { name: "Python", icon: "🐍", color: "#3776AB" },
      { name: "TypeScript", icon: "📘", color: "#3178C6" },
    ],
    mobile: [
      { name: "React Native", icon: "📱", color: "#61DAFB" },
      { name: "Flutter", icon: "🎯", color: "#02569B" },
      { name: "Swift", icon: "🍎", color: "#FA7343" },
      { name: "Kotlin", icon: "🤖", color: "#7F52FF" },
    ],
    cloud: [
      { name: "AWS", icon: "☁️", color: "#FF9900" },
      { name: "Azure", icon: "☁️", color: "#0089D6" },
      { name: "Docker", icon: "🐳", color: "#2496ED" },
      { name: "Kubernetes", icon: "⚓", color: "#326CE5" },
    ],
  };

  const features = [
    {
      icon: Code,
      title: "Custom Development",
      description:
        "Tailored software solutions built from scratch to match your exact requirements",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: Layers,
      title: "Scalable Architecture",
      description:
        "Future-proof systems designed to grow with your business needs",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: Shield,
      title: "Security First",
      description:
        "Enterprise-grade security measures protecting your data and users",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: Zap,
      title: "High Performance",
      description: "Optimized code delivering lightning-fast user experiences",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "Understanding your vision and requirements",
    },
    {
      step: "02",
      title: "Design",
      description: "Creating intuitive user experiences",
    },
    {
      step: "03",
      title: "Development",
      description: "Building with cutting-edge technology",
    },
    {
      step: "04",
      title: "Testing",
      description: "Ensuring quality and reliability",
    },
    { step: "05", title: "Launch", description: "Deploying to production" },
    {
      step: "06",
      title: "Support",
      description: "Ongoing maintenance and updates",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.gradientOrb}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <Code size={16} />
              <span>Software Development</span>
            </div>

            <h1 className={styles.heroTitle}>
              Build Software That
              <span className={styles.titleGradient}> Transforms Business</span>
            </h1>

            <p className={styles.heroDescription}>
              From enterprise applications to innovative startups, we craft
              scalable, secure, and high-performance software solutions that
              drive real results.
            </p>

            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryBtn}>
                Start Your Project
                <ArrowRight size={20} />
              </Link>
              <button className={styles.secondaryBtn}>
                <Play size={20} />
                Watch Demo
              </button>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.codeWindow}>
              <div className={styles.windowHeader}>
                <div className={styles.windowDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.windowTitle}>App.jsx</span>
              </div>
              <div className={styles.codeContent}>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>1</span>
                  <span className={styles.keyword}>import</span>
                  <span className={styles.function}> React </span>
                  <span className={styles.keyword}>from</span>
                  <span className={styles.string}> 'react'</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>2</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>3</span>
                  <span className={styles.keyword}>const</span>
                  <span className={styles.function}> App </span>
                  <span>
                    = () {"=>"} {"{"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>4</span>
                  <span> </span>
                  <span className={styles.keyword}>return</span>
                  <span>
                    {" "}
                    {"<"}div{">"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>5</span>
                  <span> </span>
                  <span className={styles.string}>Amazing Software</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>6</span>
                  <span> </span>
                  <span>
                    {"<"}/div{">"}
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>7</span>
                  <span>{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose Our Development Services</h2>
            <p>Combining technical excellence with business acumen</p>
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
                  style={{ background: feature.gradient }}
                >
                  <feature.icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className={styles.techSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Technology Stack</h2>
            <p>Modern tools for modern solutions</p>
          </div>

          <div className={styles.techTabs}>
            <button
              className={`${styles.techTab} ${activeTab === "web" ? styles.active : ""}`}
              onClick={() => setActiveTab("web")}
            >
              <Globe size={20} />
              Web Development
            </button>
            <button
              className={`${styles.techTab} ${activeTab === "mobile" ? styles.active : ""}`}
              onClick={() => setActiveTab("mobile")}
            >
              <Smartphone size={20} />
              Mobile Apps
            </button>
            <button
              className={`${styles.techTab} ${activeTab === "cloud" ? styles.active : ""}`}
              onClick={() => setActiveTab("cloud")}
            >
              <Cloud size={20} />
              Cloud & DevOps
            </button>
          </div>

          <div className={styles.techGrid}>
            {technologies[activeTab].map((tech, index) => (
              <div
                key={index}
                className={styles.techCard}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className={styles.techIcon}>{tech.icon}</span>
                <span className={styles.techName}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Development Process</h2>
            <p>Proven methodology for successful delivery</p>
          </div>

          <div className={styles.timeline}>
            {process.map((item, index) => (
              <div
                key={index}
                className={styles.timelineItem}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.timelineStep}>{item.step}</div>
                <div className={styles.timelineContent}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className={styles.timelineConnector}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      {projects.length > 0 && (
        <section className={styles.projectsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Recent Projects</h2>
              <p>See our software development in action</p>
            </div>

            <div className={styles.projectsGrid}>
              {projects.map((project, index) => (
                <Link
                  key={index}
                  to={`/portfolio/${project.slug}`}
                  className={styles.projectCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.projectImage}>
                    <img src={project.thumbnail} alt={project.title} />
                    <div className={styles.projectOverlay}>
                      <ChevronRight size={32} />
                    </div>
                  </div>
                  <div className={styles.projectInfo}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
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
          <h2>Ready to Build Your Software?</h2>
          <p>Let's discuss your project and bring your vision to life</p>
          <Link to="/contact" className={styles.ctaButton}>
            Get Started Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SoftwareDevelopment;
