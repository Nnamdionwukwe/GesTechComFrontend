import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  User,
  Building,
  Briefcase,
  CheckCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import styles from "./Contact.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Thank you! We'll get back to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          budget: "",
          message: "",
        });
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const services = [
    "Software Development",
    "Mobile App Development",
    "Web Development",
    "UI/UX Design",
    "Social Media Management",
    "Digital Marketing",
    "Other",
  ];

  const budgets = [
    "Less than #500,000",
    "#500,000 - #1,000,000",
    "#1,000,000 - #2,000,000",
    "#2,000,000 - #5,000,000",
    "#5,000,000+",
    "Not sure yet",
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "gestechc@gmail.com",
      link: "mailto:gestechc@gmail.com",
      color: "#EF4444",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+234-703-868-9373",
      link: "tel:++2347038689373",
      color: "#10B981",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Patience Offiong Streeet, Mabushipe, Abuja",
      link: "https://maps.google.com?q=GesTechCom,%20Patience%20Offiong%20Street,%20Abuja&ftid=0xa37089b95c8eb48f:0xb422ffe07fb8ec7&entry=gps&shh=CAE&lucs=,94286590,94297699,94284478,94231188,94280568,47071704,94218641,94282134,94286869&g_st=ic",
      // link: "https://maps.google.com",
      color: "#3B82F6",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Mon - Sat: 9:00 AM - 6:00 PM\nSun: Closed",
      color: "#F59E0B",
    },
  ];

  const socialLinks = [
    { icon: Linkedin, link: "https://linkedin.com", color: "#0A66C2" },
    { icon: Twitter, link: "https://twitter.com", color: "#1DA1F2" },
    {
      icon: Facebook,
      link: "https://www.facebook.com/share/1GjVzwigpm/?mibextid=wwXIfr",
      color: "#1877F2",
    },
    {
      icon: Instagram,
      link: "https://www.instagram.com/gestechcom_",
      color: "#E1306C",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div
            className={styles.gradientCircle}
            style={{ top: "10%", left: "5%" }}
          ></div>
          <div
            className={styles.gradientCircle}
            style={{ bottom: "20%", right: "10%" }}
          ></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <MessageSquare size={16} />
            <span>Get In Touch</span>
          </div>

          <h1 className={styles.heroTitle}>
            Let's Build Something
            <span className={styles.titleGradient}> Amazing Together</span>
          </h1>

          <p className={styles.heroDescription}>
            Have a project in mind? We'd love to hear about it. Fill out the
            form and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Contact Form */}
            <div className={styles.formSection}>
              <div className={styles.formHeader}>
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll be in touch soon</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">
                      <User size={18} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">
                      <Mail size={18} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">
                      <Phone size={18} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 (903) 123-4567"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="company">
                      <Building size={18} />
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="service">
                      <Briefcase size={18} />
                      Service Interested In *
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="budget">
                      <span>💰</span>
                      Project Budget
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select budget range</option>
                      {budgets.map((budget, index) => (
                        <option key={index} value={budget}>
                          {budget}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">
                    <MessageSquare size={18} />
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows="6"
                    required
                  />
                </div>

                {status.message && (
                  <div
                    className={`${styles.statusMessage} ${styles[status.type]}`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <MessageSquare size={20} />
                    )}
                    <span>{status.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.spinner}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className={styles.infoSection}>
              <div className={styles.infoHeader}>
                <h2>Contact Information</h2>
                <p>Or reach out to us directly</p>
              </div>

              <div className={styles.contactCards}>
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className={styles.contactCard}
                    style={{ "--card-color": info.color }}
                  >
                    <div className={styles.contactIcon}>
                      <info.icon size={24} />
                    </div>
                    <div className={styles.contactDetails}>
                      <h3>{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={
                            info.link.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            info.link.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p>{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className={styles.socialSection}>
                <h3>Follow Us</h3>
                <div className={styles.socialLinks}>
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      style={{ "--social-color": social.color }}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className={styles.mapPlaceholder}>
                <iframe
                  src="https://maps.google.com/maps?q=Patience+Offiong+Street,+Mabushi,+Abuja,+Nigeria&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: "16px" }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Office Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
