import React, { useState, useEffect } from "react";
import {
  Users,
  Target,
  Award,
  TrendingUp,
  Heart,
  Zap,
  Shield,
  Globe,
  Code,
  Lightbulb,
  Star,
  CheckCircle2,
  Linkedin,
  Twitter,
  Github,
  Mail,
} from "lucide-react";
import styles from "./About.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const [teamRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/agency/team`),
        fetch(`${API_URL}/api/agency/stats`),
      ]);

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeamMembers(teamData.team || mockTeam);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error("Failed to fetch about data:", error);
      setTeamMembers(mockTeam);
    }
  };

  const companyStats = [
    { value: "150+", label: "Projects Delivered", icon: Award },
    { value: "50+", label: "Happy Clients", icon: Users },
    { value: "98%", label: "Success Rate", icon: TrendingUp },
    { value: "5+", label: "Years Experience", icon: Star },
  ];

  const values = [
    {
      icon: Heart,
      title: "Client-Focused",
      description:
        "Your success is our success. We go above and beyond to exceed expectations.",
      color: "#EF4444",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We stay ahead of trends and use cutting-edge technology to solve problems.",
      color: "#F59E0B",
    },
    {
      icon: Shield,
      title: "Quality First",
      description:
        "Every project is built with meticulous attention to detail and best practices.",
      color: "#10B981",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description:
        "We deliver high-quality work on time, every time, without compromising excellence.",
      color: "#3B82F6",
    },
    {
      icon: Globe,
      title: "Transparency",
      description:
        "Open communication and honest feedback throughout every project phase.",
      color: "#8B5CF6",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We work as an extension of your team, fostering true partnership.",
      color: "#EC4899",
    },
  ];

  const mockTeam = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      bio: "10+ years leading tech companies",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "sarah@gestech.com",
      },
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CTO",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      bio: "Full-stack developer & architect",
      social: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        email: "michael@gestech.com",
      },
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      bio: "Award-winning UI/UX designer",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "emily@gestech.com",
      },
    },
    {
      id: 4,
      name: "David Kim",
      role: "Lead Developer",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      bio: "Expert in React & Node.js",
      social: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        email: "david@gestech.com",
      },
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "Marketing Director",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      bio: "Digital marketing strategist",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "lisa@gestech.com",
      },
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Project Manager",
      image: "https://randomuser.me/api/portraits/men/6.jpg",
      bio: "Agile & Scrum certified",
      social: {
        linkedin: "https://linkedin.com",
        email: "james@gestech.com",
      },
    },
  ];

  const displayTeam = teamMembers.length > 0 ? teamMembers : mockTeam;

  const milestones = [
    {
      year: "2019",
      title: "Company Founded",
      description:
        "Started with a vision to transform businesses through technology",
    },
    {
      year: "2020",
      title: "First 50 Clients",
      description: "Reached milestone of serving 50 happy clients",
    },
    {
      year: "2021",
      title: "Expanded Services",
      description: "Added mobile app development and UI/UX design",
    },
    {
      year: "2022",
      title: "Award Winner",
      description: "Recognized as Best Digital Agency in the region",
    },
    {
      year: "2023",
      title: "100+ Projects",
      description: "Successfully delivered over 100 projects",
    },
    {
      year: "2024",
      title: "Global Reach",
      description: "Serving clients across 15 countries",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div
            className={styles.floatingShape}
            style={{ top: "10%", left: "5%" }}
          >
            💡
          </div>
          <div
            className={styles.floatingShape}
            style={{ top: "20%", right: "10%" }}
          >
            🚀
          </div>
          <div
            className={styles.floatingShape}
            style={{ bottom: "30%", left: "15%" }}
          >
            ⭐
          </div>
          <div
            className={styles.floatingShape}
            style={{ bottom: "20%", right: "5%" }}
          >
            🎯
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Users size={16} />
            <span>About GesTech</span>
          </div>

          <h1 className={styles.heroTitle}>
            We Build Digital
            <span className={styles.titleGradient}>
              {" "}
              Experiences That Matter
            </span>
          </h1>

          <p className={styles.heroDescription}>
            A passionate team of developers, designers, and digital marketers
            dedicated to helping businesses thrive in the digital age.
          </p>

          {/* Stats */}
          <div className={styles.statsGrid}>
            {companyStats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>
                  <stat.icon size={28} />
                </div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <Target size={48} />
              </div>
              <h2>Our Mission</h2>
              <p>
                To empower businesses with innovative digital solutions that
                drive growth, efficiency, and success in an ever-evolving
                technological landscape.
              </p>
            </div>

            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <Star size={48} />
              </div>
              <h2>Our Vision</h2>
              <p>
                To be the world's most trusted partner for digital
                transformation, known for exceptional quality, innovation, and
                client success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <div
                key={index}
                className={styles.valueCard}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  "--value-color": value.color,
                }}
              >
                <div className={styles.valueIcon}>
                  <value.icon size={32} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Journey</h2>
            <p>Milestones that shaped our story</p>
          </div>

          <div className={styles.timeline}>
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={styles.timelineItem}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.timelineYear}>{milestone.year}</div>
                <div className={styles.timelineContent}>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
                <div className={styles.timelineDot}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Meet Our Team</h2>
            <p>The talented people behind our success</p>
          </div>

          <div className={styles.teamGrid}>
            {displayTeam.map((member, index) => (
              <div
                key={member.id}
                className={styles.teamCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.teamImage}>
                  <img src={member.image} alt={member.name} />
                </div>
                <div className={styles.teamInfo}>
                  <h3>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                  <p className={styles.teamBio}>{member.bio}</p>
                  {member.social && (
                    <div className={styles.teamSocial}>
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter size={18} />
                        </a>
                      )}
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {member.social.email && (
                        <a href={`mailto:${member.social.email}`}>
                          <Mail size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Work With Us?</h2>
          <p>
            Join the growing list of successful companies we've helped transform
          </p>
          <a href="/contact" className={styles.ctaButton}>
            Get In Touch
            <CheckCircle2 size={20} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
