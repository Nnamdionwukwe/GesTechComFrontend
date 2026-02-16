import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Search,
  Mail,
  Megaphone,
  Users,
  MousePointer,
  LineChart,
  Globe,
  Smartphone,
  ArrowRight,
  Play,
  ChevronRight,
  Zap,
  Award,
  Eye,
  ShoppingCart,
  PieChart,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./DigitalMarketing.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const DigitalMarketing = () => {
  const [activeChannel, setActiveChannel] = useState("all");
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const [serviceRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/api/agency/services/digital-marketing`),
        fetch(
          `${API_URL}/api/agency/portfolio?service=digital-marketing&limit=4`,
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

  const channels = [
    {
      id: "all",
      name: "Full Stack",
      icon: Target,
      description: "Complete digital marketing strategy",
      color: "#0EA5E9",
    },
    {
      id: "seo",
      name: "SEO",
      icon: Search,
      description: "Rank higher on Google",
      color: "#10B981",
    },
    {
      id: "ppc",
      name: "PPC Ads",
      icon: MousePointer,
      description: "Paid advertising campaigns",
      color: "#F59E0B",
    },
    {
      id: "email",
      name: "Email Marketing",
      icon: Mail,
      description: "Engage & convert subscribers",
      color: "#8B5CF6",
    },
    {
      id: "content",
      name: "Content Marketing",
      icon: Megaphone,
      description: "Valuable content that converts",
      color: "#EF4444",
    },
  ];

  const services = [
    {
      icon: Search,
      title: "Search Engine Optimization",
      description: "Get found by customers searching for your services",
      metrics: ["Keyword Rankings", "Organic Traffic", "Domain Authority"],
      color: "#10B981",
    },
    {
      icon: MousePointer,
      title: "Pay-Per-Click Advertising",
      description: "Immediate visibility with targeted ad campaigns",
      metrics: ["Google Ads", "Facebook Ads", "LinkedIn Ads"],
      color: "#F59E0B",
    },
    {
      icon: Mail,
      title: "Email Marketing",
      description: "Build relationships and drive conversions",
      metrics: ["Open Rates", "Click Rates", "Conversions"],
      color: "#8B5CF6",
    },
    {
      icon: Megaphone,
      title: "Content Marketing",
      description: "Attract and engage your target audience",
      metrics: ["Blog Posts", "Whitepapers", "Case Studies"],
      color: "#EF4444",
    },
    {
      icon: LineChart,
      title: "Conversion Optimization",
      description: "Turn more visitors into customers",
      metrics: ["A/B Testing", "Landing Pages", "User Analytics"],
      color: "#0EA5E9",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Data-driven insights for better decisions",
      metrics: ["ROI Tracking", "Campaign Reports", "KPI Dashboard"],
      color: "#06B6D4",
    },
  ];

  const results = [
    { value: "350%", label: "Avg ROI", icon: DollarSign },
    { value: "5M+", label: "Leads Generated", icon: Users },
    { value: "85%", label: "Client Retention", icon: Award },
    { value: "#50M+", label: "Revenue Driven", icon: TrendingUp },
  ];

  const process = [
    {
      icon: Target,
      title: "Strategy",
      description: "Define goals, KPIs, and target audience",
    },
    {
      icon: Zap,
      title: "Execute",
      description: "Launch campaigns across channels",
    },
    {
      icon: Activity,
      title: "Monitor",
      description: "Track performance in real-time",
    },
    {
      icon: TrendingUp,
      title: "Optimize",
      description: "Continuously improve results",
    },
  ];

  const metrics = [
    { name: "Traffic Growth", value: "↑ 285%", color: "#10B981" },
    { name: "Conversion Rate", value: "↑ 156%", color: "#0EA5E9" },
    { name: "Cost Per Lead", value: "↓ 67%", color: "#EF4444" },
    { name: "Return on Ad Spend", value: "↑ 423%", color: "#F59E0B" },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.chartGrid}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={styles.chartBar}
                style={{
                  "--delay": `${i * 0.1}s`,
                  "--height": `${Math.random() * 100}%`,
                }}
              ></div>
            ))}
          </div>
          <div
            className={styles.floatingMetric}
            style={{ top: "15%", left: "10%" }}
          >
            <TrendingUp size={20} />
            <span>+285%</span>
          </div>
          <div
            className={styles.floatingMetric}
            style={{ top: "25%", right: "15%" }}
          >
            <DollarSign size={20} />
            <span>$2.5M</span>
          </div>
          <div
            className={styles.floatingMetric}
            style={{ bottom: "30%", left: "5%" }}
          >
            <Users size={20} />
            <span>50K+</span>
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <TrendingUp size={16} />
              <span>Digital Marketing Services</span>
            </div>

            <h1 className={styles.heroTitle}>
              Drive Growth With
              <span className={styles.titleGradient}>
                {" "}
                Data-Driven Marketing
              </span>
            </h1>

            <p className={styles.heroDescription}>
              From SEO to PPC, we create high-performance marketing campaigns
              that generate leads, increase sales, and maximize your ROI across
              all digital channels.
            </p>

            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryBtn}>
                Get Your Free Marketing Audit
                <ArrowRight size={20} />
              </Link>
              <button className={styles.secondaryBtn}>
                <Play size={20} />
                See Our Results
              </button>
            </div>

            <div className={styles.heroMetrics}>
              {metrics.map((metric, index) => (
                <div key={index} className={styles.metricCard}>
                  <div
                    className={styles.metricValue}
                    style={{ color: metric.color }}
                  >
                    {metric.value}
                  </div>
                  <div className={styles.metricLabel}>{metric.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboardCard}>
              <div className={styles.dashboardHeader}>
                <div className={styles.dashboardTitle}>
                  Performance Dashboard
                </div>
                <div className={styles.dashboardPeriod}>Last 30 Days</div>
              </div>
              <div className={styles.dashboardStats}>
                {results.slice(0, 2).map((result, index) => (
                  <div key={index} className={styles.dashboardStat}>
                    <result.icon size={24} className={styles.dashboardIcon} />
                    <div>
                      <div className={styles.dashboardValue}>
                        {result.value}
                      </div>
                      <div className={styles.dashboardLabel}>
                        {result.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.dashboardChart}>
                <div className={styles.chartLine}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Channels */}
      <section className={styles.channelsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Marketing Channels We Master</h2>
            <p>Multi-channel strategies for maximum impact</p>
          </div>

          <div className={styles.channelsGrid}>
            {channels.map((channel, index) => (
              <div
                key={channel.id}
                className={`${styles.channelCard} ${activeChannel === channel.id ? styles.active : ""}`}
                onClick={() => setActiveChannel(channel.id)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  "--channel-color": channel.color,
                }}
              >
                <div className={styles.channelIcon}>
                  <channel.icon size={32} />
                </div>
                <h3>{channel.name}</h3>
                <p>{channel.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Digital Marketing Services</h2>
            <p>Comprehensive solutions for every marketing need</p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div
                key={index}
                className={styles.serviceCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={styles.serviceIcon}
                  style={{ background: service.color }}
                >
                  <service.icon size={28} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className={styles.metricsList}>
                  {service.metrics.map((metric, i) => (
                    <span key={i} className={styles.metricBadge}>
                      <ChevronRight size={14} />
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className={styles.resultsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Real Results That Matter</h2>
            <p>Data doesn't lie - see what we deliver</p>
          </div>

          <div className={styles.resultsGrid}>
            {results.map((result, index) => (
              <div
                key={index}
                className={styles.resultCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.resultIcon}>
                  <result.icon size={32} />
                </div>
                <div className={styles.resultValue}>{result.value}</div>
                <div className={styles.resultLabel}>{result.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Proven Process</h2>
            <p>A systematic approach to marketing success</p>
          </div>

          <div className={styles.processGrid}>
            {process.map((step, index) => (
              <div
                key={index}
                className={styles.processCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.processIcon}>
                  <step.icon size={32} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className={styles.processStep}>0{index + 1}</div>
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
              <h2>Case Studies</h2>
              <p>Success stories from our marketing campaigns</p>
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
                      <BarChart3 size={32} />
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
            <TrendingUp size={64} />
          </div>
          <h2>Ready to Accelerate Your Growth?</h2>
          <p>
            Let's create a winning digital marketing strategy for your business
          </p>
          <Link to="/contact" className={styles.ctaButton}>
            Schedule Your Free Consultation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DigitalMarketing;
