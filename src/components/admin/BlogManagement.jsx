import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Loader,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  Tag,
  Filter,
  Calendar,
  User,
} from "lucide-react";
import styles from "./BlogManagement.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const CATEGORIES = [
  "Technology",
  "Design",
  "Business",
  "Marketing",
  "Development",
  "Tutorial",
  "News",
  "Case Study",
  "Other",
];
const STATUSES = ["draft", "published", "archived"];

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  author_name: "",
  featured_image: "",
  status: "draft",
  is_featured: false,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
};

const token = () => localStorage.getItem("token");
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// ── Toast ─────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => (
  <div className={`${styles.toast} ${styles[type]}`}>
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{msg}</span>
    <button onClick={onClose}>
      <X size={13} />
    </button>
  </div>
);

// ── Confirm ───────────────────────────────────────────────────────────────
const Confirm = ({ post, onConfirm, onCancel }) => (
  <div className={styles.overlay} onClick={onCancel}>
    <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
      <Trash2 size={32} className={styles.confirmIcon} />
      <h3>Delete Post?</h3>
      <p>
        Permanently delete <strong>"{post.title}"</strong>? This cannot be
        undone.
      </p>
      <div className={styles.confirmActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.dangerBtn} onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Blog Modal ────────────────────────────────────────────────────────────
const BlogModal = ({ post, onClose, onSave, saving }) => {
  const [form, setForm] = useState(
    post
      ? {
          ...post,
          tags: Array.isArray(post.tags)
            ? post.tags.join(", ")
            : typeof post.tags === "string"
              ? post.tags
              : "",
          meta_keywords: Array.isArray(post.meta_keywords)
            ? post.meta_keywords.join(", ")
            : post.meta_keywords || "",
        }
      : { ...EMPTY_FORM },
  );

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Auto-slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug: post ? f.slug : slugify(title),
      meta_title: post ? f.meta_title : title,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) return;
    const tags = form.tags
      ? form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    const meta_keywords = form.meta_keywords
      ? form.meta_keywords
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    onSave({ ...form, tags, meta_keywords });
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{post ? "Edit Blog Post" : "New Blog Post"}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {/* Core */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Content</h4>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>
                  Title <span className={styles.req}>*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="Enter post title…"
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>
                  Slug <span className={styles.req}>*</span>
                </label>
                <div className={styles.slugWrap}>
                  <span className={styles.slugPrefix}>/blog/</span>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
                    }
                    placeholder="post-slug"
                    required
                  />
                </div>
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Excerpt</label>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={set}
                  rows="2"
                  placeholder="Short summary shown in listings…"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>
                  Content <span className={styles.req}>*</span>
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={set}
                  rows="10"
                  placeholder="Full post content (Markdown or HTML supported)…"
                  required
                />
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Details</h4>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select name="category" value={form.category} onChange={set}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select name="status" value={form.status} onChange={set}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Author Name</label>
                <input
                  name="author_name"
                  value={form.author_name}
                  onChange={set}
                  placeholder="John Doe"
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  Tags <span className={styles.hint}>(comma-separated)</span>
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={set}
                  placeholder="React, Node.js, API"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Featured Image URL</label>
                <input
                  name="featured_image"
                  value={form.featured_image}
                  onChange={set}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>SEO</h4>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Meta Title</label>
                <input
                  name="meta_title"
                  value={form.meta_title}
                  onChange={set}
                  placeholder="SEO title (defaults to post title)"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Meta Description</label>
                <textarea
                  name="meta_description"
                  value={form.meta_description}
                  onChange={set}
                  rows="2"
                  placeholder="SEO description (defaults to excerpt)"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>
                  Meta Keywords{" "}
                  <span className={styles.hint}>(comma-separated)</span>
                </label>
                <input
                  name="meta_keywords"
                  value={form.meta_keywords}
                  onChange={set}
                  placeholder="react, javascript, api"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Settings</h4>
            <div className={styles.toggleRow}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={set}
                />
                <span className={styles.slider} />
                <span>Featured Post</span>
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? (
                <Loader size={16} className={styles.spin} />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving…" : post ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Post Row ──────────────────────────────────────────────────────────────
const PostRow = ({ post, onEdit, onDelete }) => {
  const statusClass =
    {
      published: styles.statusPublished,
      draft: styles.statusDraft,
      archived: styles.statusArchived,
    }[post.status] || styles.statusDraft;

  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string" && post.tags
      ? post.tags.split(",").map((t) => t.trim())
      : [];

  return (
    <div className={styles.postRow}>
      {post.featured_image && (
        <div className={styles.postThumb}>
          <img src={post.featured_image} alt={post.title} />
        </div>
      )}
      <div className={styles.postInfo}>
        <div className={styles.postMeta}>
          <span className={statusClass}>{post.status}</span>
          {post.is_featured && (
            <span className={styles.featuredBadge}>
              <Star size={11} /> Featured
            </span>
          )}
          {post.category && (
            <span className={styles.categoryBadge}>{post.category}</span>
          )}
        </div>
        <h3 className={styles.postTitle}>{post.title}</h3>
        {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
        <div className={styles.postDetails}>
          {post.author_name && (
            <span>
              <User size={13} /> {post.author_name}
            </span>
          )}
          <span>
            <Calendar size={13} />{" "}
            {fmtDate(post.published_at || post.created_at)}
          </span>
          {tags.length > 0 && (
            <span className={styles.tagList}>
              <Tag size={13} />
              {tags.slice(0, 3).map((t, i) => (
                <span key={i} className={styles.tag}>
                  {t}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
      <div className={styles.postActions}>
        <button className={styles.editBtn} onClick={() => onEdit(post)}>
          <Edit2 size={15} />
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(post)}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast, setToast] = useState(null);
  const LIMIT = 10;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(filterStatus && { status: filterStatus }),
        ...(filterCat && { category: filterCat }),
        ...(search && { search }),
      });
      const res = await fetch(`${API_URL}/api/admin/blog?${params}`, {
        headers: headers(),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.data?.posts || data.posts || []);
        setPagination(data.data?.pagination || data.pagination || {});
      }
    } catch {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterCat, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const isEdit = !!editPost;
      const url = isEdit
        ? `${API_URL}/api/admin/blog/${editPost.id}`
        : `${API_URL}/api/admin/blog`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: headers(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Post updated!" : "Post created!");
        setShowModal(false);
        setEditPost(null);
        fetchPosts();
      } else {
        showToast(data.error || "Save failed", "error");
      }
    } catch {
      showToast("Connection error", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/blog/${confirmDel.id}`, {
        method: "DELETE",
        headers: headers(),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Post deleted");
        setConfirmDel(null);
        fetchPosts();
      } else {
        showToast(data.error || "Delete failed", "error");
      }
    } catch {
      showToast("Connection error", "error");
    }
  };

  const openEdit = (post) => {
    setEditPost(post);
    setShowModal(true);
  };
  const openAdd = () => {
    setEditPost(null);
    setShowModal(true);
  };

  const totalPages = pagination.pages || 1;
  const counts = {
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
  };

  return (
    <div className={styles.page}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <div className={styles.pageTitleIcon}>
            <BookOpen size={22} />
          </div>
          <div>
            <h1>Blog Posts</h1>
            <p>{pagination.total ?? posts.length} posts total</p>
          </div>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          <Plus size={18} /> New Post
        </button>
      </div>

      {/* Status tabs */}
      <div className={styles.statusTabs}>
        {[
          { label: "All", value: "" },
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived" },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`${styles.statusTab} ${filterStatus === tab.value ? styles.activeTab : ""}`}
            onClick={() => {
              setFilterStatus(tab.value);
              setPage(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by title, author, category…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {search && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearch("")}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className={styles.filterGroup}>
          <Filter size={15} />
          <select
            value={filterCat}
            onChange={(e) => {
              setFilterCat(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className={styles.loadingState}>
          <Loader size={32} className={styles.spin} />
          <p>Loading posts…</p>
        </div>
      ) : posts.length === 0 ? (
        <div className={styles.emptyState}>
          <BookOpen size={48} />
          <h3>No posts found</h3>
          <p>Start writing your first blog post.</p>
          <button className={styles.addBtn} onClick={openAdd}>
            <Plus size={16} /> New Post
          </button>
        </div>
      ) : (
        <div className={styles.postList}>
          {posts.map((p) => (
            <PostRow
              key={p.id}
              post={p}
              onEdit={openEdit}
              onDelete={setConfirmDel}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={16} />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <BlogModal
          post={editPost}
          onClose={() => {
            setShowModal(false);
            setEditPost(null);
          }}
          onSave={handleSave}
          saving={saving}
        />
      )}
      {confirmDel && (
        <Confirm
          post={confirmDel}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDel(null)}
        />
      )}
    </div>
  );
};

export default BlogManagement;
