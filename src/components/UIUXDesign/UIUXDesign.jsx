import React, { useState, useEffect } from "react";
import {
  Palette,
  Pen,
  Users,
  Layers,
  MousePointer,
  Smartphone,
  Monitor,
  Eye,
  Heart,
  Zap,
  Grid,
  Figma,
  ArrowRight,
  Play,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./UIUXDesign.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const UIUXDesign = () => {
  const [activePhase, setActivePhase] = useState("research");
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const [serviceRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/api/agency/services/ui-ux-design`),
        fetch(`${API_URL}/api/agency/portfolio?service=ui-ux-design&limit=6`),
      ]);

      const serviceData = await serviceRes.json();
      const projectsData = await projectsRes.json();

      setStats(serviceData.service);
      setProjects(projectsData.projects || []);
    } catch (error) {
      console.error("Failed to fetch service data:", error);
    }
  };

  const designPhases = [
    {
      id: "research",
      name: "Research",
      icon: Target,
      color: "#EC4899",
      description: "Understanding users, competitors, and market trends",
    },
    {
      id: "wireframe",
      name: "Wireframe",
      icon: Grid,
      color: "#8B5CF6",
      description: "Creating low-fidelity layouts and information architecture",
    },
    {
      id: "design",
      name: "Visual Design",
      icon: Palette,
      color: "#F59E0B",
      description: "Crafting beautiful, on-brand visual interfaces",
    },
    {
      id: "prototype",
      name: "Prototype",
      icon: MousePointer,
      color: "#10B981",
      description: "Building interactive prototypes for testing",
    },
  ];

  const services = [
    {
      title: "Web Design",
      icon: Monitor,
      description: "Beautiful, responsive website designs",
      features: [
        "Landing Pages",
        "Dashboards",
        "Admin Panels",
        "SaaS Platforms",
      ],
    },
    {
      title: "Mobile App Design",
      icon: Smartphone,
      description: "Native iOS & Android app interfaces",
      features: ["iOS Design", "Android Design", "Tablet Layouts", "Wearables"],
    },
    {
      title: "Design Systems",
      icon: Layers,
      description: "Scalable component libraries",
      features: [
        "Style Guides",
        "Component Libraries",
        "Documentation",
        "Tokens",
      ],
    },
    {
      title: "User Research",
      icon: Users,
      description: "Data-driven design decisions",
      features: [
        "User Interviews",
        "Usability Testing",
        "Personas",
        "Journey Maps",
      ],
    },
  ];

  const principles = [
    {
      icon: Heart,
      title: "User-Centered",
      description: "Every decision driven by user needs and behavior",
    },
    {
      icon: Eye,
      title: "Visually Stunning",
      description: "Beautiful aesthetics that align with your brand",
    },
    {
      icon: Zap,
      title: "Intuitive",
      description: "Interfaces so simple, no manual needed",
    },
    {
      icon: TrendingUp,
      title: "Conversion-Focused",
      description: "Designs that drive measurable business results",
    },
  ];

  const tools = [
    { name: "Figma", icon: "🎨", color: "#F24E1E" },
    { name: "Adobe XD", icon: "✨", color: "#FF61F6" },
    { name: "Sketch", icon: "💎", color: "#FDB300" },
    { name: "Framer", icon: "⚡", color: "#0055FF" },
    { name: "Principle", icon: "🎬", color: "#6B5CE7" },
    { name: "InVision", icon: "💫", color: "#FF3366" },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div
            className={styles.colorBlob}
            style={{ background: "#EC4899" }}
          ></div>
          <div
            className={styles.colorBlob}
            style={{ background: "#8B5CF6" }}
          ></div>
          <div
            className={styles.colorBlob}
            style={{ background: "#F59E0B" }}
          ></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <Palette size={16} />
              <span>UI/UX Design Services</span>
            </div>

            <h1 className={styles.heroTitle}>
              Design That
              <span className={styles.titleGradient}>
                {" "}
                Captivates & Converts
              </span>
            </h1>

            <p className={styles.heroDescription}>
              We create stunning, user-friendly interfaces that not only look
              amazing but deliver exceptional user experiences that drive
              engagement and growth.
            </p>

            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryBtn}>
                Start Your Design Project
                <ArrowRight size={20} />
              </Link>
              <button className={styles.secondaryBtn}>
                <Play size={20} />
                View Portfolio
              </button>
            </div>

            <div className={styles.heroMetrics}>
              <div className={styles.metric}>
                <Sparkles size={24} />
                <div>
                  <div className={styles.metricValue}>300+</div>
                  <div className={styles.metricLabel}>Designs Created</div>
                </div>
              </div>
              <div className={styles.metric}>
                <Heart size={24} />
                <div>
                  <div className={styles.metricValue}>98%</div>
                  <div className={styles.metricLabel}>Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.designCanvas}>
              <div
                className={styles.canvasLayer}
                style={{ "--delay": "0s" }}
              ></div>
              <div
                className={styles.canvasLayer}
                style={{ "--delay": "0.2s" }}
              ></div>
              <div
                className={styles.canvasLayer}
                style={{ "--delay": "0.4s" }}
              ></div>
              <div className={styles.cursor}>
                <MousePointer size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Process */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Design Process</h2>
            <p>
              A proven methodology for creating exceptional user experiences
            </p>
          </div>

          <div className={styles.phaseGrid}>
            {designPhases.map((phase, index) => (
              <div
                key={phase.id}
                className={`${styles.phaseCard} ${activePhase === phase.id ? styles.active : ""}`}
                onClick={() => setActivePhase(phase.id)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  "--phase-color": phase.color,
                }}
              >
                <div className={styles.phaseIcon}>
                  <phase.icon size={32} />
                </div>
                <h3>{phase.name}</h3>
                <p>{phase.description}</p>
                <div className={styles.phaseNumber}>0{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Design Services</h2>
            <p>Comprehensive design solutions for all platforms</p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div
                key={index}
                className={styles.serviceCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.serviceIcon}>
                  <service.icon size={32} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className={styles.featureList}>
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <ChevronRight size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className={styles.principlesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Design Principles</h2>
            <p>The foundation of every interface we create</p>
          </div>

          <div className={styles.principlesGrid}>
            {principles.map((principle, index) => (
              <div
                key={index}
                className={styles.principleCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.principleIcon}>
                  <principle.icon size={28} />
                </div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className={styles.toolsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Design Tools We Use</h2>
            <p>Industry-leading software for world-class results</p>
          </div>

          <div className={styles.toolsGrid}>
            {tools.map((tool, index) => (
              <div
                key={index}
                className={styles.toolCard}
                style={{
                  animationDelay: `${index * 0.05}s`,
                  "--tool-color": tool.color,
                }}
              >
                <span className={styles.toolIcon}>{tool.icon}</span>
                <span className={styles.toolName}>{tool.name}</span>
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
              <h2>Design Portfolio</h2>
              <p>Beautiful interfaces we've crafted</p>
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
                      <Eye size={32} />
                    </div>
                  </div>
                  <div className={styles.portfolioInfo}>
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
          <div className={styles.ctaIcon}>
            <Palette size={64} />
          </div>
          <h2>Ready to Create Something Beautiful?</h2>
          <p>Let's design an experience your users will love</p>
          <Link to="/contact" className={styles.ctaButton}>
            Start Your Design Project
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UIUXDesign;
