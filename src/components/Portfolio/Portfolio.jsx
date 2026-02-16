import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ExternalLink,
  Calendar,
  Tag,
  Award,
  TrendingUp,
  Users,
  Code,
  Smartphone,
  Globe,
  Palette,
  Share2,
  BarChart3,
} from "lucide-react";
import styles from "./Portfolio.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [activeFilter, searchQuery, projects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agency/portfolio`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects || []);
        setFilteredProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (project) =>
          project.category?.toLowerCase() === activeFilter.toLowerCase() ||
          project.service?.toLowerCase().includes(activeFilter.toLowerCase()),
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.technologies?.some((tech) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredProjects(filtered);
  };

  const categories = [
    { id: "all", label: "All Projects", icon: Award },
    { id: "software-development", label: "Software", icon: Code },
    { id: "mobile-app-development", label: "Mobile Apps", icon: Smartphone },
    { id: "web-development", label: "Websites", icon: Globe },
    { id: "ui-ux-design", label: "Design", icon: Palette },
    { id: "social-media", label: "Social Media", icon: Share2 },
    { id: "digital-marketing", label: "Marketing", icon: BarChart3 },
  ];

  const stats = [
    { value: "150+", label: "Projects Completed", icon: Award },
    { value: "98%", label: "Client Satisfaction", icon: Users },
    { value: "50+", label: "Active Clients", icon: TrendingUp },
    { value: "5 Years", label: "In Business", icon: Calendar },
  ];

  // Mock project data if API doesn't return any
  const mockProjects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Modern online shopping platform with AI recommendations",
      thumbnail:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
      category: "web-development",
      technologies: ["React", "Node.js", "MongoDB"],
      client: "RetailCo",
      year: "2024",
    },
    {
      id: 2,
      title: "Fitness Tracking App",
      description: "Mobile app for tracking workouts and nutrition",
      thumbnail:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
      category: "mobile-app-development",
      technologies: ["React Native", "Firebase"],
      client: "FitLife",
      year: "2024",
    },
    {
      id: 3,
      title: "Brand Identity Design",
      description: "Complete brand redesign for a tech startup",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      category: "ui-ux-design",
      technologies: ["Figma", "Adobe XD"],
      client: "TechStart",
      year: "2023",
    },
  ];

  const displayProjects =
    filteredProjects.length > 0 ? filteredProjects : mockProjects;

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridPattern}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Award size={16} />
            <span>Our Work</span>
          </div>

          <h1 className={styles.heroTitle}>
            Projects We're
            <span className={styles.titleGradient}> Proud Of</span>
          </h1>

          <p className={styles.heroDescription}>
            Explore our portfolio of successful projects across web development,
            mobile apps, design, and digital marketing.
          </p>

          {/* Stats */}
          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.stat}>
                <stat.icon size={24} className={styles.statIcon} />
                <div>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.container}>
          {/* Search Bar */}
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search projects, technologies, or clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className={styles.filters}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.filterBtn} ${activeFilter === category.id ? styles.active : ""}`}
                onClick={() => setActiveFilter(category.id)}
              >
                <category.icon size={18} />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className={styles.projectsSection}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 && searchQuery ? (
            <div className={styles.noResults}>
              <Search size={48} />
              <h3>No projects found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={styles.projectsGrid}>
              {displayProjects.map((project, index) => (
                <div
                  key={project.id || index}
                  className={styles.projectCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.projectImage}>
                    <img
                      src={
                        project.thumbnail ||
                        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
                      }
                      alt={project.title}
                    />
                    <div className={styles.projectOverlay}>
                      <Link
                        to={`/portfolio/${project.slug || project.id}`}
                        className={styles.viewProject}
                      >
                        <ExternalLink size={24} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.projectContent}>
                    <div className={styles.projectMeta}>
                      {project.category && (
                        <span className={styles.category}>
                          <Tag size={14} />
                          {project.category.replace(/-/g, " ")}
                        </span>
                      )}
                      {project.year && (
                        <span className={styles.year}>
                          <Calendar size={14} />
                          {project.year}
                        </span>
                      )}
                    </div>

                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className={styles.techStack}>
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className={styles.techBadge}>
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className={styles.techBadge}>
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                    {project.client && (
                      <div className={styles.client}>
                        <Users size={14} />
                        <span>Client: {project.client}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Want to Be Our Next Success Story?</h2>
          <p>
            Let's discuss your project and create something amazing together
          </p>
          <Link to="/contact" className={styles.ctaButton}>
            Start Your Project
            <ExternalLink size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
