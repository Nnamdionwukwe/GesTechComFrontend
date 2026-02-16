import React, { useState, useEffect } from "react";
import {
  Share2,
  TrendingUp,
  Heart,
  MessageCircle,
  Users,
  BarChart,
  Calendar,
  Camera,
  Zap,
  Target,
  Award,
  Clock,
  ArrowRight,
  Play,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./SocialMediaManagement.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const SocialMediaManagement = () => {
  const [activePlatform, setActivePlatform] = useState("all");
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const [serviceRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/api/agency/services/social-media-management`),
        fetch(
          `${API_URL}/api/agency/portfolio?service=social-media-management&limit=4`,
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
    { id: "all", name: "All Platforms", icon: Share2, color: "#6366F1" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "#E1306C" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2" },
    { id: "twitter", name: "Twitter/X", icon: Twitter, color: "#1DA1F2" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000" },
  ];

  const services = [
    {
      icon: Calendar,
      title: "Content Planning",
      description: "Strategic content calendars aligned with your goals",
      features: [
        "Monthly Planning",
        "Content Strategy",
        "Posting Schedule",
        "Holiday Campaigns",
      ],
    },
    {
      icon: Camera,
      title: "Content Creation",
      description: "Eye-catching posts, stories, and videos",
      features: [
        "Graphics Design",
        "Video Editing",
        "Copywriting",
        "Photography",
      ],
    },
    {
      icon: Users,
      title: "Community Management",
      description: "Engage with your audience and build relationships",
      features: [
        "Reply Management",
        "DM Responses",
        "Comment Moderation",
        "Crisis Management",
      ],
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Data-driven insights to optimize performance",
      features: [
        "Performance Metrics",
        "Audience Insights",
        "Competitor Analysis",
        "ROI Tracking",
      ],
    },
    {
      icon: Target,
      title: "Paid Advertising",
      description: "Targeted ads to reach your ideal audience",
      features: [
        "Ad Campaigns",
        "Audience Targeting",
        "A/B Testing",
        "Budget Optimization",
      ],
    },
    {
      icon: TrendingUp,
      title: "Growth Strategy",
      description: "Proven tactics to grow your following",
      features: [
        "Follower Growth",
        "Engagement Rate",
        "Brand Awareness",
        "Lead Generation",
      ],
    },
  ];

  const results = [
    { metric: "500%", label: "Avg. Follower Growth" },
    { metric: "8x", label: "Engagement Increase" },
    { metric: "2M+", label: "Impressions Generated" },
    { metric: "95%", label: "Client Satisfaction" },
  ];

  const contentTypes = [
    { icon: "📸", name: "Photo Posts", description: "High-quality images" },
    {
      icon: "🎬",
      name: "Video Content",
      description: "Engaging videos & reels",
    },
    { icon: "📝", name: "Text Posts", description: "Compelling copy" },
    { icon: "📊", name: "Infographics", description: "Data visualization" },
    { icon: "🎨", name: "Carousel Posts", description: "Multi-image stories" },
    { icon: "🎯", name: "Stories", description: "Ephemeral content" },
    { icon: "🎙️", name: "Live Sessions", description: "Real-time engagement" },
    { icon: "💬", name: "User-Generated", description: "Community content" },
  ];

  const selectedPlatform = platforms.find((p) => p.id === activePlatform);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div
            className={styles.socialBubble}
            style={{ top: "10%", left: "5%" }}
          >
            <Heart size={24} />
          </div>
          <div
            className={styles.socialBubble}
            style={{ top: "20%", right: "10%" }}
          >
            <MessageCircle size={24} />
          </div>
          <div
            className={styles.socialBubble}
            style={{ bottom: "25%", left: "15%" }}
          >
            <ThumbsUp size={24} />
          </div>
          <div
            className={styles.socialBubble}
            style={{ bottom: "15%", right: "5%" }}
          >
            <Share2 size={24} />
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <Share2 size={16} />
              <span>Social Media Management</span>
            </div>

            <h1 className={styles.heroTitle}>
              Grow Your Brand
              <span className={styles.titleGradient}>
                {" "}
                Through Social Media
              </span>
            </h1>

            <p className={styles.heroDescription}>
              From strategy to execution, we manage your social media presence
              so you can focus on running your business. Build a loyal community
              and drive real results.
            </p>

            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryBtn}>
                Boost Your Social Presence
                <ArrowRight size={20} />
              </Link>
              <button className={styles.secondaryBtn}>
                <Play size={20} />
                See Success Stories
              </button>
            </div>

            <div className={styles.heroStats}>
              {results.map((result, index) => (
                <div key={index} className={styles.stat}>
                  <div className={styles.statValue}>{result.metric}</div>
                  <div className={styles.statLabel}>{result.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneScreen}>
                <div className={styles.post}>
                  <div className={styles.postHeader}>
                    <div className={styles.postAvatar}></div>
                    <div className={styles.postInfo}>
                      <div className={styles.postName}></div>
                      <div className={styles.postTime}></div>
                    </div>
                  </div>
                  <div className={styles.postImage}></div>
                  <div className={styles.postActions}>
                    <Heart className={styles.actionIcon} />
                    <MessageCircle className={styles.actionIcon} />
                    <Share2 className={styles.actionIcon} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className={styles.platformsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Platforms We Manage</h2>
            <p>Full-service management across all major social networks</p>
          </div>

          <div className={styles.platformsGrid}>
            {platforms.map((platform, index) => (
              <div
                key={platform.id}
                className={`${styles.platformCard} ${activePlatform === platform.id ? styles.active : ""}`}
                onClick={() => setActivePlatform(platform.id)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  "--platform-color": platform.color,
                }}
              >
                <div className={styles.platformIcon}>
                  <platform.icon size={32} />
                </div>
                <h3>{platform.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Services</h2>
            <p>Everything you need for social media success</p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div
                key={index}
                className={styles.serviceCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.serviceIcon}>
                  <service.icon size={28} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className={styles.featureList}>
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <ChevronRight size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Content We Create</h2>
            <p>Diverse content formats to keep your audience engaged</p>
          </div>

          <div className={styles.contentGrid}>
            {contentTypes.map((type, index) => (
              <div
                key={index}
                className={styles.contentCard}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className={styles.contentIcon}>{type.icon}</span>
                <h4>{type.name}</h4>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>Our proven 4-step process for social media success</p>
          </div>

          <div className={styles.processGrid}>
            <div className={styles.processCard}>
              <div className={styles.processNumber}>01</div>
              <h3>Discover & Plan</h3>
              <p>
                We analyze your brand, audience, and competitors to create a
                winning strategy
              </p>
            </div>
            <div className={styles.processCard}>
              <div className={styles.processNumber}>02</div>
              <h3>Create Content</h3>
              <p>
                Our team produces high-quality, engaging content tailored to
                your brand
              </p>
            </div>
            <div className={styles.processCard}>
              <div className={styles.processNumber}>03</div>
              <h3>Publish & Engage</h3>
              <p>We post consistently and interact with your community daily</p>
            </div>
            <div className={styles.processCard}>
              <div className={styles.processNumber}>04</div>
              <h3>Analyze & Optimize</h3>
              <p>
                Monthly reports and continuous optimization for better results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {projects.length > 0 && (
        <section className={styles.portfolioSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Success Stories</h2>
              <p>Brands we've helped grow on social media</p>
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
                      <TrendingUp size={32} />
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
            <Share2 size={64} />
          </div>
          <h2>Ready to Dominate Social Media?</h2>
          <p>Let's build a thriving online community for your brand</p>
          <Link to="/contact" className={styles.ctaButton}>
            Get Your Free Strategy Call
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SocialMediaManagement;
