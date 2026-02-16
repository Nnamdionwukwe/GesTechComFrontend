import React, { useState, useEffect } from "react";
import {
  Globe,
  Zap,
  ShoppingCart,
  Users,
  Search,
  Palette,
  Code2,
  Rocket,
  Server,
  Monitor,
  Smartphone,
  Shield,
  TrendingUp,
  ArrowRight,
  Play,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./WebDevelopment.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const WebDevelopment = () => {
  const [activeService, setActiveService] = useState("ecommerce");
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const [serviceRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/api/agency/services/web-development`),
        fetch(
          `${API_URL}/api/agency/portfolio?service=web-development&limit=6`,
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

  const services = [
    {
      id: "ecommerce",
      name: "E-Commerce Websites",
      icon: ShoppingCart,
      description: "Full-featured online stores with payment integration",
      features: [
        "Shopping Cart",
        "Payment Gateway",
        "Inventory Management",
        "Order Tracking",
      ],
      color: "#10B981",
    },
    {
      id: "corporate",
      name: "Corporate Websites",
      icon: Monitor,
      description: "Professional business websites that build trust",
      features: [
        "CMS Integration",
        "Contact Forms",
        "Blog System",
        "Multi-language",
      ],
      color: "#3B82F6",
    },
    {
      id: "portfolio",
      name: "Portfolio Sites",
      icon: Palette,
      description: "Stunning portfolios for creatives and professionals",
      features: [
        "Gallery Systems",
        "Case Studies",
        "Client Testimonials",
        "Contact Forms",
      ],
      color: "#8B5CF6",
    },
    {
      id: "webapp",
      name: "Web Applications",
      icon: Code2,
      description: "Custom web apps for complex business needs",
      features: [
        "User Authentication",
        "Database Integration",
        "Real-time Updates",
        "API Development",
      ],
      color: "#F59E0B",
    },
  ];

  const technologies = [
    { name: "React", icon: "⚛️", category: "Frontend" },
    { name: "Next.js", icon: "▲", category: "Frontend" },
    { name: "Vue.js", icon: "💚", category: "Frontend" },
    { name: "Node.js", icon: "🟢", category: "Backend" },
    { name: "Python", icon: "🐍", category: "Backend" },
    { name: "PostgreSQL", icon: "🐘", category: "Database" },
    { name: "MongoDB", icon: "🍃", category: "Database" },
    { name: "AWS", icon: "☁️", category: "Cloud" },
  ];

  const features = [
    {
      icon: Monitor,
      title: "Responsive Design",
      description: "Perfect on every device - desktop, tablet, and mobile",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with 90+ PageSpeed scores",
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description: "Built for search engines to help you rank higher",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "SSL, backups, and security best practices included",
    },
    {
      icon: Users,
      title: "User-Friendly",
      description: "Intuitive interfaces that convert visitors to customers",
    },
    {
      icon: Rocket,
      title: "Easy to Update",
      description: "Simple CMS to manage your content without coding",
    },
  ];

  const process = [
    {
      number: "01",
      title: "Discovery & Planning",
      description: "We analyze your needs, competitors, and target audience",
      icon: Search,
    },
    {
      number: "02",
      title: "Design & Wireframes",
      description: "Creating mockups and getting your approval",
      icon: Palette,
    },
    {
      number: "03",
      title: "Development",
      description: "Building your website with clean, modern code",
      icon: Code2,
    },
    {
      number: "04",
      title: "Testing & QA",
      description: "Rigorous testing across devices and browsers",
      icon: CheckCircle2,
    },
    {
      number: "05",
      title: "Launch",
      description: "Deploy to production and go live",
      icon: Rocket,
    },
    {
      number: "06",
      title: "Support & Growth",
      description: "Ongoing maintenance, updates, and optimization",
      icon: TrendingUp,
    },
  ];

  const selectedService = services.find((s) => s.id === activeService);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.browserWindow}>
            <div className={styles.browserHeader}>
              <div className={styles.browserDots}></div>
              <div className={styles.browserUrl}>
                www.your-amazing-website.com
              </div>
            </div>
            <div className={styles.browserContent}></div>
          </div>
          <div className={styles.floatingElements}>
            <div
              className={styles.floatingElement}
              style={{ top: "10%", left: "10%" }}
            >
              💻
            </div>
            <div
              className={styles.floatingElement}
              style={{ top: "20%", right: "15%" }}
            >
              🚀
            </div>
            <div
              className={styles.floatingElement}
              style={{ bottom: "30%", left: "5%" }}
            >
              ⚡
            </div>
            <div
              className={styles.floatingElement}
              style={{ bottom: "20%", right: "10%" }}
            >
              🎨
            </div>
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Globe size={16} />
            <span>Web Development Services</span>
          </div>

          <h1 className={styles.heroTitle}>
            Beautiful Websites That
            <span className={styles.titleGradient}> Drive Results</span>
          </h1>

          <p className={styles.heroDescription}>
            From landing pages to complex web applications, we create
            responsive, fast, and SEO-friendly websites that help your business
            grow online.
          </p>

          <div className={styles.heroButtons}>
            <Link to="/contact" className={styles.primaryBtn}>
              Start Your Website
              <ArrowRight size={20} />
            </Link>
            <button className={styles.secondaryBtn}>
              <Play size={20} />
              See Our Work
            </button>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>200+</div>
              <div className={styles.statLabel}>Websites Built</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>95+</div>
              <div className={styles.statLabel}>PageSpeed Score</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>99.9%</div>
              <div className={styles.statLabel}>Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>What We Build</h2>
            <p>Professional websites tailored to your business needs</p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`${styles.serviceCard} ${activeService === service.id ? styles.active : ""}`}
                onClick={() => setActiveService(service.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={styles.serviceIcon}
                  style={{ background: service.color }}
                >
                  <service.icon size={32} />
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className={styles.serviceFeatures}>
                  {service.features.map((feature, i) => (
                    <span key={i} className={styles.featureBadge}>
                      <CheckCircle2 size={14} />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose Our Web Development</h2>
            <p>Built with modern technology and best practices</p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={styles.featureCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.featureIcon}>
                  <feature.icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className={styles.techSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Technology Stack</h2>
            <p>Modern tools for modern websites</p>
          </div>

          <div className={styles.techGrid}>
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={styles.techCard}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className={styles.techIcon}>{tech.icon}</span>
                <div className={styles.techInfo}>
                  <span className={styles.techName}>{tech.name}</span>
                  <span className={styles.techCategory}>{tech.category}</span>
                </div>
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
            <p>From concept to launch in 6 proven steps</p>
          </div>

          <div className={styles.processGrid}>
            {process.map((step, index) => (
              <div
                key={index}
                className={styles.processCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.processNumber}>{step.number}</div>
                <div className={styles.processIcon}>
                  <step.icon size={32} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
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
              <h2>Recent Web Projects</h2>
              <p>Real websites we've built for real businesses</p>
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
                      <ExternalLink size={32} />
                    </div>
                  </div>
                  <div className={styles.portfolioInfo}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.technologies && (
                      <div className={styles.portfolioTech}>
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className={styles.portfolioCTA}>
              <Link to="/portfolio" className={styles.viewAllBtn}>
                View All Projects
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}>
            <Globe size={64} />
          </div>
          <h2>Ready to Build Your Website?</h2>
          <p>Let's create a stunning online presence for your business</p>
          <Link to="/contact" className={styles.ctaButton}>
            Get Your Free Quote
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopment;
