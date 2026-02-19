// src/components/admin/ServicesManagement.jsx
import { useState, useEffect, useCallback } from "react";
import styles from "./ServicesManagement.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const CATEGORIES = [
  "software-development",
  "mobile-app-development",
  "web-development",
  "ui-ux-design",
  "social-media-management",
  "digital-marketing",
];

const PRICING_MODELS = ["fixed", "hourly", "monthly", "custom"];

const EMPTY_FORM = {
  name: "",
  slug: "",
  category: "",
  tagline: "",
  description: "",
  features: "",
  deliverables: "",
  technologies: "",
  pricing_starts_at: "",
  pricing_model: "fixed",
  timeline: "",
  is_featured: false,
  is_active: true,
  display_order: 0,
  icon: "",
  thumbnail: "",
  hero_image: "",
  meta_title: "",
  meta_description: "",
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState("list");
  const [editTarget, setEditTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterCat) params.set("category", filterCat);
      const res = await fetch(`${API_BASE}/api/agency/services?${params}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setServices(data.services || []);
      else setError(data.error || "Failed to load services");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [filterCat]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (!success && !error) return;
    const t = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);
    return () => clearTimeout(t);
  }, [success, error]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setView("create");
  }

  function openEdit(service) {
    setForm({
      name: service.name || "",
      slug: service.slug || "",
      category: service.category || "",
      tagline: service.tagline || "",
      description: service.description || "",
      features: Array.isArray(service.features)
        ? service.features.join(", ")
        : service.features || "",
      deliverables: Array.isArray(service.deliverables)
        ? service.deliverables.join(", ")
        : service.deliverables || "",
      technologies: Array.isArray(service.technologies)
        ? service.technologies.join(", ")
        : service.technologies || "",
      pricing_starts_at: service.pricing_starts_at || "",
      pricing_model: service.pricing_model || "fixed",
      timeline: service.timeline || "",
      is_featured: service.is_featured || false,
      is_active: service.is_active !== false,
      display_order: service.display_order || 0,
      icon: service.icon || "",
      thumbnail: service.thumbnail || "",
      hero_image: service.hero_image || "",
      meta_title: service.meta_title || "",
      meta_description: service.meta_description || "",
    });
    setEditTarget(service);
    setView("edit");
  }

  function handleField(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && !editTarget
        ? { slug: slugify(value), meta_title: value }
        : {}),
    }));
  }

  function buildPayload() {
    const csv = (v) =>
      v
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    return {
      ...form,
      features: csv(form.features),
      deliverables: csv(form.deliverables),
      technologies: csv(form.technologies),
      pricing_starts_at: form.pricing_starts_at
        ? parseFloat(form.pricing_starts_at)
        : null,
      display_order: parseInt(form.display_order) || 0,
    };
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/services`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Service created!");
        setView("list");
        fetchServices();
      } else setError(data.error || "Failed to create service");
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
        `${API_BASE}/api/admin/services/${editTarget.id}`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(buildPayload()),
        },
      );
      const data = await res.json();
      if (data.success) {
        setSuccess("Service updated!");
        setView("list");
        fetchServices();
      } else setError(data.error || "Failed to update service");
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
      const res = await fetch(`${API_BASE}/api/admin/services/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Service deleted.");
        setServices((s) => s.filter((x) => x.id !== id));
      } else setError(data.error || "Failed to delete");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  const displayed = services.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.tagline?.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.subtitle}>
            {services.length} service{services.length !== 1 ? "s" : ""} total
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
              + New Service
            </button>
          )}
        </div>
      </div>

      {success && <div className={styles.flashSuccess}>{success}</div>}
      {error && <div className={styles.flashError}>{error}</div>}

      {/* LIST */}
      {view === "list" && (
        <>
          <div className={styles.toolbar}>
            <input
              className={styles.searchInput}
              placeholder="Search services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className={styles.spinnerWrap}>
              <div className={styles.spinner} />
              Loading services…
            </div>
          ) : displayed.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyEmoji}>🛠️</div>
              <p className={styles.emptyText}>No services found.</p>
              <button className={styles.btnPrimary} onClick={openCreate}>
                Create your first service
              </button>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {[
                      "Service",
                      "Category",
                      "Pricing",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className={styles.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((s) => (
                    <tr key={s.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.serviceCell}>
                          <div className={styles.serviceIcon}>
                            {s.icon || s.name?.[0]?.toUpperCase() || "S"}
                          </div>
                          <div>
                            <div className={styles.serviceName}>{s.name}</div>
                            <div className={styles.serviceTagline}>
                              {s.tagline || s.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.categoryBadge}>
                          {s.category?.replace(/-/g, " ") || "—"}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.pricingWrap}>
                          {s.pricing_starts_at
                            ? `$${Number(s.pricing_starts_at).toLocaleString()}`
                            : "—"}
                          <span className={styles.pricingModel}>
                            {s.pricing_model}
                          </span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.statusPillWrap}>
                          <span
                            className={
                              s.is_active
                                ? styles.pillActive
                                : styles.pillInactive
                            }
                          >
                            {s.is_active ? "Active" : "Inactive"}
                          </span>
                          {s.is_featured && (
                            <span className={styles.pillFeatured}>
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.rowActions}>
                          <button
                            className={styles.btnEdit}
                            onClick={() => openEdit(s)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.btnDelete}
                            onClick={() => setConfirmDelete(s)}
                            disabled={deleting === s.id}
                          >
                            {deleting === s.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* CREATE / EDIT */}
      {(view === "create" || view === "edit") && (
        <form
          onSubmit={view === "create" ? handleCreate : handleUpdate}
          className={styles.form}
        >
          <div className={styles.formGrid}>
            {/* LEFT */}
            <div className={styles.formCol}>
              <Section title="Basic Info">
                <Field label="Service Name *">
                  <input
                    className={styles.input}
                    name="name"
                    value={form.name}
                    onChange={handleField}
                    required
                    placeholder="e.g. Custom Web Development"
                  />
                </Field>
                <Field label="Slug *">
                  <input
                    className={styles.input}
                    name="slug"
                    value={form.slug}
                    onChange={handleField}
                    required
                    placeholder="custom-web-development"
                  />
                </Field>
                <Field label="Category *">
                  <select
                    className={styles.input}
                    name="category"
                    value={form.category}
                    onChange={handleField}
                    required
                  >
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Tagline">
                  <input
                    className={styles.input}
                    name="tagline"
                    value={form.tagline}
                    onChange={handleField}
                    placeholder="Short catchy description"
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={styles.textarea}
                    name="description"
                    value={form.description}
                    onChange={handleField}
                    placeholder="Full service description…"
                  />
                </Field>
              </Section>

              <Section title="Details (comma-separated)">
                <Field label="Features">
                  <input
                    className={styles.input}
                    name="features"
                    value={form.features}
                    onChange={handleField}
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
                </Field>
                <Field label="Deliverables">
                  <input
                    className={styles.input}
                    name="deliverables"
                    value={form.deliverables}
                    onChange={handleField}
                    placeholder="Deliverable 1, Deliverable 2"
                  />
                </Field>
                <Field label="Technologies">
                  <input
                    className={styles.input}
                    name="technologies"
                    value={form.technologies}
                    onChange={handleField}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </Field>
                <Field label="Timeline">
                  <input
                    className={styles.input}
                    name="timeline"
                    value={form.timeline}
                    onChange={handleField}
                    placeholder="e.g. 4–8 weeks"
                  />
                </Field>
              </Section>
            </div>

            {/* RIGHT */}
            <div className={styles.formCol}>
              <Section title="Pricing">
                <Field label="Starting Price ($)">
                  <input
                    className={styles.input}
                    name="pricing_starts_at"
                    type="number"
                    value={form.pricing_starts_at}
                    onChange={handleField}
                    placeholder="e.g. 500"
                    min="0"
                  />
                </Field>
                <Field label="Pricing Model">
                  <select
                    className={styles.input}
                    name="pricing_model"
                    value={form.pricing_model}
                    onChange={handleField}
                  >
                    {PRICING_MODELS.map((m) => (
                      <option key={m} value={m}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
              </Section>

              <Section title="Media">
                <Field label="Icon (emoji or URL)">
                  <input
                    className={styles.input}
                    name="icon"
                    value={form.icon}
                    onChange={handleField}
                    placeholder="💻 or https://..."
                  />
                </Field>
                <Field label="Thumbnail URL">
                  <input
                    className={styles.input}
                    name="thumbnail"
                    value={form.thumbnail}
                    onChange={handleField}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Hero Image URL">
                  <input
                    className={styles.input}
                    name="hero_image"
                    value={form.hero_image}
                    onChange={handleField}
                    placeholder="https://..."
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
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleField}
                    />
                    Active (visible to users)
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleField}
                    />
                    Featured (highlighted)
                  </label>
                </div>
              </Section>

              <Section title="SEO">
                <Field label="Meta Title">
                  <input
                    className={styles.input}
                    name="meta_title"
                    value={form.meta_title}
                    onChange={handleField}
                    placeholder="Page title for search engines"
                  />
                </Field>
                <Field label="Meta Description">
                  <textarea
                    className={styles.textarea}
                    name="meta_description"
                    value={form.meta_description}
                    onChange={handleField}
                    placeholder="Short description for search results…"
                    style={{ minHeight: 72 }}
                  />
                </Field>
              </Section>
            </div>
          </div>

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
                  ? "Create Service"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Delete modal */}
      {confirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Delete Service</h3>
            <p className={styles.modalBody}>
              Are you sure you want to delete{" "}
              <strong>{confirmDelete.name}</strong>? This cannot be undone.
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
