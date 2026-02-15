import React, { useState, useEffect } from "react";
import {
  Code,
  Smartphone,
  Globe,
  Palette,
  Share2,
  TrendingUp,
  ArrowRight,
  Check,
  Star,
  Zap,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import styles from "./AgencyHomePage.module.css";
import { Link } from "react-router-dom";

// ✅ FIXED: Changed default port from 5001 to 5000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AgencyHomePage = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({
    projects: 150,
    clients: 80,
    satisfaction: 98,
    experience: 10,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes, testimonialsRes] = await Promise.all([
        fetch(`${API_URL}/api/agency/services`),
        fetch(`${API_URL}/api/agency/portfolio?limit=6`),
        fetch(`${API_URL}/api/agency/testimonials?featured=true`),
      ]);

      const servicesData = await servicesRes.json();
      const projectsData = await projectsRes.json();
      const testimonialsData = await testimonialsRes.json();

      setServices(servicesData.services || []);
      setProjects(projectsData.projects || []);
      setTestimonials(testimonialsData.testimonials || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const serviceIcons = {
    "software-development": Code,
    "mobile-app-development": Smartphone,
    "web-development": Globe,
    "ui-ux-design": Palette,
    "social-media-management": Share2,
    "digital-marketing": TrendingUp,
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.badge}>
              <Zap size={16} />
              <span>Welcome to GesTech</span>
            </span>
            <h1 className={styles.heroTitle}>
              Transform Your Business with
              <span className={styles.gradient}> Cutting-Edge Technology</span>
            </h1>
            <p className={styles.heroDescription}>
              We build powerful software solutions, stunning mobile apps, and
              create engaging digital experiences that drive growth and
              innovation.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryButton}>
                Start Your Project
                <ArrowRight size={20} />
              </Link>
              <Link to="/portfolio" className={styles.secondaryButton}>
                View Our Work
              </Link>
            </div>

            {/* Stats */}
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <h3>{stats.projects}+</h3>
                <p>Projects Completed</p>
              </div>
              <div className={styles.stat}>
                <h3>{stats.clients}+</h3>
                <p>Happy Clients</p>
              </div>
              <div className={styles.stat}>
                <h3>{stats.satisfaction}%</h3>
                <p>Satisfaction Rate</p>
              </div>
              <div className={styles.stat}>
                <h3>{stats.experience}+</h3>
                <p>Years Experience</p>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.floatingCard}>
              <div className={styles.cardHeader}>
                <div className={styles.dots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine} style={{ width: "60%" }}></div>
                <div className={styles.codeLine} style={{ width: "80%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Our Services</span>
            <h2 className={styles.sectionTitle}>
              What We <span className={styles.gradient}>Do Best</span>
            </h2>
            <p className={styles.sectionDescription}>
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.slice(0, 6).map((service) => {
              const Icon = serviceIcons[service.category] || Code;
              return (
                <Link
                  to={`/services/${service.slug}`}
                  key={service.id}
                  className={styles.serviceCard}
                >
                  <div className={styles.serviceIcon}>
                    <Icon size={32} />
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.tagline}</p>
                  <div className={styles.serviceFeatures}>
                    {service.features?.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className={styles.featureBadge}>
                        <Check size={14} />
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className={styles.serviceFooter}>
                    <span className={styles.pricing}>
                      From ${service.pricing_starts_at?.toLocaleString()}
                    </span>
                    <ChevronRight size={20} className={styles.arrow} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <div className={styles.whyContent}>
              <span className={styles.sectionBadge}>Why Choose Us</span>
              <h2 className={styles.sectionTitle}>
                We Deliver <span className={styles.gradient}>Excellence</span>
              </h2>
              <p className={styles.whyDescription}>
                With over a decade of experience and a proven track record, we
                combine technical expertise with creative innovation to deliver
                solutions that exceed expectations.
              </p>

              <div className={styles.whyFeatures}>
                <div className={styles.whyFeature}>
                  <div className={styles.whyIcon}>
                    <Award size={24} />
                  </div>
                  <div>
                    <h4>Award-Winning Team</h4>
                    <p>Recognized experts in software development and design</p>
                  </div>
                </div>

                <div className={styles.whyFeature}>
                  <div className={styles.whyIcon}>
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4>Fast Delivery</h4>
                    <p>Agile methodology ensures quick turnaround times</p>
                  </div>
                </div>

                <div className={styles.whyFeature}>
                  <div className={styles.whyIcon}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h4>Dedicated Support</h4>
                    <p>24/7 customer support and maintenance services</p>
                  </div>
                </div>
              </div>

              <Link to="/about" className={styles.primaryButton}>
                Learn More About Us
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className={styles.whyVisual}>
              <div className={styles.statsCard}>
                <div className={styles.statsCardItem}>
                  <h3>150+</h3>
                  <p>Projects Delivered</p>
                </div>
                <div className={styles.statsCardItem}>
                  <h3>98%</h3>
                  <p>Client Satisfaction</p>
                </div>
                <div className={styles.statsCardItem}>
                  <h3>80+</h3>
                  <p>Global Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Portfolio</span>
            <h2 className={styles.sectionTitle}>
              Our Recent <span className={styles.gradient}>Work</span>
            </h2>
            <p className={styles.sectionDescription}>
              Explore our latest projects and success stories
            </p>
          </div>

          <div className={styles.portfolioGrid}>
            {projects.map((project) => (
              <Link
                to={`/portfolio/${project.slug}`}
                key={project.id}
                className={styles.projectCard}
              >
                <div className={styles.projectImage}>
                  <img
                    src={project.thumbnail || "/placeholder-project.jpg"}
                    alt={project.title}
                  />
                  <div className={styles.projectOverlay}>
                    <span className={styles.projectCategory}>
                      {project.service_name}
                    </span>
                  </div>
                </div>
                <div className={styles.projectContent}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.technologies && (
                    <div className={styles.techStack}>
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className={styles.techBadge}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.sectionCTA}>
            <Link to="/portfolio" className={styles.secondaryButton}>
              View All Projects
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Testimonials</span>
            <h2 className={styles.sectionTitle}>
              What Our <span className={styles.gradient}>Clients Say</span>
            </h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className={styles.testimonialCard}>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < testimonial.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className={styles.testimonialContent}>
                  "{testimonial.content}"
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    {testimonial.author_avatar ? (
                      <img
                        src={testimonial.author_avatar}
                        alt={testimonial.author_name}
                      />
                    ) : (
                      <span>{testimonial.author_name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4>{testimonial.author_name}</h4>
                    <p>{testimonial.author_position}</p>
                    {testimonial.client_name && (
                      <span className={styles.companyName}>
                        {testimonial.client_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Your Next Project?</h2>
            <p>Let's build something amazing together</p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.ctaPrimary}>
                Get Started Now
                <ArrowRight size={20} />
              </Link>
              <Link to="/services" className={styles.ctaSecondary}>
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgencyHomePage;
