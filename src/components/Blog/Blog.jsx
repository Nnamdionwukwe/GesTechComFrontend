import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Code,
  Smartphone,
  Globe,
  Palette,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import styles from "./Blog.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const mockPosts = [
  {
    id: 1,
    title: "10 React Best Practices for 2026",
    excerpt:
      "Learn the latest best practices for building modern React applications with performance and maintainability in mind.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    category: "development",
    author: "Sarah Johnson",
    authorImage: "https://randomuser.me/api/portraits/women/1.jpg",
    date: "2024-02-15",
    readTime: "8 min read",
    tags: ["React", "JavaScript", "Best Practices"],
    slug: "react-best-practices-2024",
  },
  {
    id: 2,
    title: "The Future of Mobile App Development",
    excerpt:
      "Explore emerging trends and technologies shaping the future of mobile application development.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    category: "mobile",
    author: "Michael Chen",
    authorImage: "https://randomuser.me/api/portraits/men/2.jpg",
    date: "2024-02-12",
    readTime: "6 min read",
    tags: ["Mobile", "React Native", "Flutter"],
    slug: "future-mobile-development",
  },
  {
    id: 3,
    title: "UI/UX Design Trends in 2024",
    excerpt:
      "Discover the latest design trends that are transforming user experiences across digital platforms.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    category: "design",
    author: "Emily Rodriguez",
    authorImage: "https://randomuser.me/api/portraits/women/3.jpg",
    date: "2024-02-10",
    readTime: "10 min read",
    tags: ["UI/UX", "Design", "Trends"],
    slug: "ui-ux-trends-2024",
  },
  {
    id: 4,
    title: "SEO Strategies That Actually Work",
    excerpt:
      "Proven SEO techniques to boost your website rankings and drive organic traffic in 2026.",
    image:
      "https://www.techmagnate.com/wp-content/uploads/2024/01/Effective-SEO-Strategies_-What-They-Are-9-Ways-to-Rank-Higher.webp",
    category: "marketing",
    author: "Lisa Anderson",
    authorImage: "https://randomuser.me/api/portraits/women/5.jpg",
    date: "2024-02-08",
    readTime: "12 min read",
    tags: ["SEO", "Marketing", "Google"],
    slug: "https://www.techmagnate.com/blog/seo-strategies/",
  },
  {
    id: 5,
    title: "Building Scalable Web Applications",
    excerpt:
      "Learn how to architect and build web applications that can handle millions of users.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    category: "web",
    author: "David Kim",
    authorImage: "https://randomuser.me/api/portraits/men/4.jpg",
    date: "2024-02-05",
    readTime: "15 min read",
    tags: ["Web", "Architecture", "Scalability"],
    slug: "scalable-web-apps",
  },
  {
    id: 6,
    title: "Git Tips Every Developer Should Know",
    excerpt:
      "Master Git with these essential tips and tricks that will make you a more productive developer.",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800",
    category: "tips",
    author: "James Wilson",
    authorImage: "https://randomuser.me/api/portraits/men/6.jpg",
    date: "2024-02-01",
    readTime: "7 min read",
    tags: ["Git", "Development", "Tips"],
    slug: "git-tips-developers",
  },
];

const categories = [
  { id: "all", label: "All Posts", icon: BookOpen },
  { id: "development", label: "Development", icon: Code },
  { id: "design", label: "Design", icon: Palette },
  { id: "marketing", label: "Marketing", icon: BarChart3 },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "web", label: "Web", icon: Globe },
  { id: "tips", label: "Tips & Tricks", icon: Lightbulb },
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success' | error string
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [activeCategory, searchQuery, posts]);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agency/blog`);
      const data = await response.json();
      if (data.success && data.posts?.length) {
        setPosts(data.posts);
        setFeaturedPost(data.posts[0]);
      } else {
        setPosts(mockPosts);
        setFeaturedPost(mockPosts[0]);
      }
    } catch {
      setPosts(mockPosts);
      setFeaturedPost(mockPosts[0]);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts.length ? posts : mockPosts;
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase(),
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    setFilteredPosts(filtered);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterLoading(true);
    setNewsletterStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/agency/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterStatus("success");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus(
          data.error || "Something went wrong. Please try again.",
        );
      }
    } catch {
      setNewsletterStatus("Failed to subscribe. Please try again.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const displayPosts =
    filteredPosts.length > 0
      ? filteredPosts
      : searchQuery || activeCategory !== "all"
        ? []
        : mockPosts;

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          {[
            { t: "15%", l: "10%", e: "📚" },
            { t: "25%", r: "15%", e: "✍️" },
            { b: "30%", l: "5%", e: "💡" },
            { b: "20%", r: "10%", e: "🚀" },
          ].map((f, i) => (
            <div
              key={i}
              className={styles.floatingIcon}
              style={{ top: f.t, left: f.l, right: f.r, bottom: f.b }}
            >
              {f.e}
            </div>
          ))}
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <BookOpen size={16} />
            <span>Our Blog</span>
          </div>
          <h1 className={styles.heroTitle}>
            Insights &
            <span className={styles.titleGradient}> Knowledge Hub</span>
          </h1>
          <p className={styles.heroDescription}>
            Stay updated with the latest trends, tutorials, and insights in web
            development, design, and digital marketing.
          </p>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search articles, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.categories}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon size={18} /> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Post ── */}
      {featuredPost && !searchQuery && activeCategory === "all" && (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <div className={styles.featuredBadge}>
              <TrendingUp size={16} /> Featured Article
            </div>
            <Link
              to={`/blog/${featuredPost.slug}`}
              className={styles.featuredPost}
            >
              <div className={styles.featuredImage}>
                <img src={featuredPost.image} alt={featuredPost.title} />
                <div className={styles.featuredOverlay} />
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.featuredMeta}>
                  <span className={styles.category}>
                    <Tag size={14} />
                    {featuredPost.category}
                  </span>
                  <span className={styles.readTime}>
                    <Clock size={14} />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <div className={styles.featuredAuthor}>
                  <img
                    src={featuredPost.authorImage}
                    alt={featuredPost.author}
                  />
                  <div>
                    <div className={styles.authorName}>
                      {featuredPost.author}
                    </div>
                    <div className={styles.postDate}>
                      <Calendar size={14} />
                      {new Date(featuredPost.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── Posts Grid ── */}
      <section className={styles.postsSection}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading posts...</p>
            </div>
          ) : displayPosts.length === 0 ? (
            <div className={styles.noResults}>
              <Search size={48} />
              <h3>No articles found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {displayPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className={styles.postCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.postImage}>
                    <img src={post.image} alt={post.title} />
                    <div className={styles.postCategory}>{post.category}</div>
                  </div>
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span>
                        <Calendar size={14} />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    {post.tags && (
                      <div className={styles.tags}>
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className={styles.postFooter}>
                      <div className={styles.author}>
                        <img src={post.authorImage} alt={post.author} />
                        <span>{post.author}</span>
                      </div>
                      <div className={styles.readMore}>
                        Read More <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>📬 Subscribe to Our Newsletter</h2>
          <p>Get the latest articles and insights delivered to your inbox</p>

          {newsletterStatus === "success" ? (
            <div className={styles.newsletterSuccess}>
              ✅ Successfully subscribed! Great articles are on their way.
            </div>
          ) : (
            <form
              className={styles.newsletterForm}
              onSubmit={handleNewsletterSubmit}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                disabled={newsletterLoading}
              />
              <button type="submit" disabled={newsletterLoading}>
                {newsletterLoading ? (
                  "Subscribing..."
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {newsletterStatus && newsletterStatus !== "success" && (
            <p className={styles.newsletterError}>{newsletterStatus}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
