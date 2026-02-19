// src/components/admin/TestimonialsManagement.jsx
import { useState, useEffect, useCallback } from "react";
import styles from "./TestimonialsManagement.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const EMPTY_FORM = {
  author_name: "",
  author_position: "",
  author_avatar: "",
  client_name: "",
  client_logo: "",
  content: "",
  rating: 5,
  project_id: "",
  service_id: "",
  is_featured: false,
  is_approved: true,
  display_order: 0,
};

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${(hovered || value) >= star ? styles.starFilled : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
      <span className={styles.ratingLabel}>{value} / 5</span>
    </div>
  );
}

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState("list");
  const [editTarget, setEditTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterApproved, setFilterApproved] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ── Fetch ─────────────────────────────────────────────────────
  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/agency/testimonials`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials || []);
      else setError(data.error || "Failed to load testimonials");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    if (!success && !error) return;
    const t = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);
    return () => clearTimeout(t);
  }, [success, error]);

  // ── Helpers ───────────────────────────────────────────────────
  function openCreate() {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setView("create");
  }

  function openEdit(t) {
    setForm({
      author_name: t.author_name || "",
      author_position: t.author_position || "",
      author_avatar: t.author_avatar || "",
      client_name: t.client_name || "",
      client_logo: t.client_logo || "",
      content: t.content || "",
      rating: t.rating ?? 5,
      project_id: t.project_id || "",
      service_id: t.service_id || "",
      is_featured: t.is_featured || false,
      is_approved: t.is_approved !== false,
      display_order: t.display_order || 0,
    });
    setEditTarget(t);
    setView("edit");
  }

  function handleField(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function buildPayload() {
    return {
      ...form,
      rating: parseInt(form.rating) || 5,
      display_order: parseInt(form.display_order) || 0,
      project_id: form.project_id || null,
      service_id: form.service_id || null,
      author_avatar: form.author_avatar || null,
      client_logo: form.client_logo || null,
    };
  }

  // ── CRUD ──────────────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/testimonials`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Testimonial created!");
        setView("list");
        fetchTestimonials();
      } else setError(data.error || "Failed to create");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/testimonials/${editTarget.id}`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(buildPayload()),
        },
      );
      const data = await res.json();
      if (data.success) {
        setSuccess("Testimonial updated!");
        setView("list");
        fetchTestimonials();
      } else setError(data.error || "Failed to update");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(id);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Testimonial deleted.");
        setTestimonials((t) => t.filter((x) => x.id !== id));
      } else setError(data.error || "Failed to delete");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  // ── Derived ───────────────────────────────────────────────────
  const displayed = testimonials.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.author_name?.toLowerCase().includes(q) ||
      t.client_name?.toLowerCase().includes(q) ||
      t.content?.toLowerCase().includes(q);
    const matchApproved =
      filterApproved === ""
        ? true
        : filterApproved === "approved"
          ? t.is_approved
          : !t.is_approved;
    return matchSearch && matchApproved;
  });

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Testimonials</h1>
          <p className={styles.subtitle}>
            {testimonials.length} testimonial
            {testimonials.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className={styles.headerActions}>
          {view !== "list" && (
            <button className={styles.btnGhost} onClick={() => setView("list")}>
              ← Back
            </button>
          )}
          {view === "list" && (
            <button className={styles.btnPrimary} onClick={openCreate}>
              + New Testimonial
            </button>
          )}
        </div>
      </div>

      {success && <div className={styles.flashSuccess}>{success}</div>}
      {error && <div className={styles.flashError}>{error}</div>}

      {/* ── LIST ── */}
      {view === "list" && (
        <>
          <div className={styles.toolbar}>
            <input
              className={styles.searchInput}
              placeholder="Search by name, client, or content…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {loading ? (
            <div className={styles.spinnerWrap}>
              <div className={styles.spinner} />
              Loading testimonials…
            </div>
          ) : displayed.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyEmoji}>💬</div>
              <p className={styles.emptyText}>No testimonials found.</p>
              <button className={styles.btnPrimary} onClick={openCreate}>
                Add first testimonial
              </button>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {displayed.map((t) => (
                <div key={t.id} className={styles.card}>
                  {/* Card header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.avatarWrap}>
                      {t.author_avatar ? (
                        <img
                          src={t.author_avatar}
                          alt={t.author_name}
                          className={styles.avatar}
                        />
                      ) : (
                        <div className={styles.avatarFallback}>
                          {t.author_name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorName}>{t.author_name}</div>
                      <div className={styles.authorPosition}>
                        {t.author_position || t.client_name || "—"}
                      </div>
                    </div>
                    <div className={styles.cardPills}>
                      <span
                        className={
                          t.is_approved
                            ? styles.pillApproved
                            : styles.pillPending
                        }
                      >
                        {t.is_approved ? "Approved" : "Pending"}
                      </span>
                      {t.is_featured && (
                        <span className={styles.pillFeatured}>Featured</span>
                      )}
                    </div>
                  </div>

                  {/* Stars */}
                  <div className={styles.cardStars}>
                    {"★".repeat(t.rating || 5)}
                    {"☆".repeat(5 - (t.rating || 5))}
                    <span className={styles.ratingNum}>{t.rating || 5}/5</span>
                  </div>

                  {/* Content */}
                  <p className={styles.cardContent}>
                    "
                    {t.content?.length > 140
                      ? t.content.slice(0, 140) + "…"
                      : t.content}
                    "
                  </p>

                  {/* Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.rowActions}>
                      <button
                        className={styles.btnEdit}
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => setConfirmDelete(t)}
                        disabled={deleting === t.id}
                      >
                        {deleting === t.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── CREATE / EDIT FORM ── */}
      {(view === "create" || view === "edit") && (
        <form
          onSubmit={view === "create" ? handleCreate : handleUpdate}
          className={styles.form}
        >
          <div className={styles.formGrid}>
            {/* LEFT */}
            <div className={styles.formCol}>
              <Section title="Author Info">
                <Field label="Author Name *">
                  <input
                    className={styles.input}
                    name="author_name"
                    value={form.author_name}
                    onChange={handleField}
                    required
                    placeholder="e.g. John Doe"
                  />
                </Field>
                <Field label="Position / Title">
                  <input
                    className={styles.input}
                    name="author_position"
                    value={form.author_position}
                    onChange={handleField}
                    placeholder="e.g. CEO at Acme Inc."
                  />
                </Field>
                <Field label="Avatar URL">
                  <input
                    className={styles.input}
                    name="author_avatar"
                    value={form.author_avatar}
                    onChange={handleField}
                    placeholder="https://..."
                  />
                </Field>
              </Section>

              <Section title="Client Info">
                <Field label="Client / Company Name">
                  <input
                    className={styles.input}
                    name="client_name"
                    value={form.client_name}
                    onChange={handleField}
                    placeholder="e.g. Acme Inc."
                  />
                </Field>
                <Field label="Client Logo URL">
                  <input
                    className={styles.input}
                    name="client_logo"
                    value={form.client_logo}
                    onChange={handleField}
                    placeholder="https://..."
                  />
                </Field>
              </Section>

              <Section title="Rating">
                <Field label="Star Rating">
                  <StarRating
                    value={parseInt(form.rating) || 5}
                    onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                  />
                </Field>
              </Section>
            </div>

            {/* RIGHT */}
            <div className={styles.formCol}>
              <Section title="Testimonial Content">
                <Field label="Content *">
                  <textarea
                    className={styles.textarea}
                    name="content"
                    value={form.content}
                    onChange={handleField}
                    required
                    placeholder="What did the client say…"
                    style={{ minHeight: 140 }}
                  />
                </Field>
              </Section>

              <Section title="Linked Records (optional)">
                <Field label="Project ID">
                  <input
                    className={styles.input}
                    name="project_id"
                    value={form.project_id}
                    onChange={handleField}
                    placeholder="UUID of linked project"
                  />
                </Field>
                <Field label="Service ID">
                  <input
                    className={styles.input}
                    name="service_id"
                    value={form.service_id}
                    onChange={handleField}
                    placeholder="UUID of linked service"
                  />
                </Field>
              </Section>

              <Section title="Settings">
                <Field label="Display Order">
                  <input
                    className={styles.input}
                    name="display_order"
                    type="number"
                    value={form.display_order}
                    onChange={handleField}
                    min="0"
                  />
                </Field>
                <div className={styles.checkboxRow}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_approved"
                      checked={form.is_approved}
                      onChange={handleField}
                    />
                    Approved (visible to users)
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleField}
                    />
                    Featured (highlighted on site)
                  </label>
                </div>
              </Section>
            </div>
          </div>

          {/* Preview */}
          {form.content && (
            <div className={styles.preview}>
              <div className={styles.previewLabel}>Preview</div>
              <div className={styles.previewCard}>
                <div className={styles.previewStars}>
                  {"★".repeat(form.rating || 5)}
                  {"☆".repeat(5 - (form.rating || 5))}
                </div>
                <p className={styles.previewContent}>"{form.content}"</p>
                <div className={styles.previewAuthor}>
                  — {form.author_name || "Author"}
                  {form.author_position ? `, ${form.author_position}` : ""}
                  {form.client_name ? ` · ${form.client_name}` : ""}
                </div>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => setView("list")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : view === "create"
                  ? "Create Testimonial"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Delete modal */}
      {confirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Delete Testimonial</h3>
            <p className={styles.modalBody}>
              Delete testimonial from{" "}
              <strong>{confirmDelete.author_name}</strong>? This cannot be
              undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.btnGhost}
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnDelete}
                style={{ padding: "0.625rem 1.25rem" }}
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deleting === confirmDelete.id}
              >
                {deleting === confirmDelete.id ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}
