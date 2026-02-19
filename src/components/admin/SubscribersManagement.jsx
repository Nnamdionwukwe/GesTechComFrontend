// src/components/admin/SubscribersManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Search,
  Trash2,
  UserMinus,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingDown,
  Calendar,
  Filter,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// ─── helpers ────────────────────────────────────────────────────────────────

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

// ─── sub-components ─────────────────────────────────────────────────────────

const StatPill = ({ icon: Icon, label, value, accent }) => (
  <div style={styles.statPill}>
    <div style={{ ...styles.statPillIcon, background: accent + "22" }}>
      <Icon size={18} style={{ color: accent }} />
    </div>
    <div>
      <div style={styles.statPillValue}>{value}</div>
      <div style={styles.statPillLabel}>{label}</div>
    </div>
  </div>
);

const Badge = ({ active }) =>
  active ? (
    <span style={{ ...styles.badge, ...styles.badgeActive }}>
      <CheckCircle size={11} /> Active
    </span>
  ) : (
    <span style={{ ...styles.badge, ...styles.badgeInactive }}>
      <XCircle size={11} /> Unsubscribed
    </span>
  );

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div style={styles.modalBackdrop}>
    <div style={styles.modal}>
      <p style={styles.modalMsg}>{message}</p>
      <div style={styles.modalActions}>
        <button style={styles.btnSecondary} onClick={onCancel}>
          Cancel
        </button>
        <button style={styles.btnDanger} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  </div>
);

// ─── main component ──────────────────────────────────────────────────────────

const SubscribersManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all"); // "all" | "active" | "inactive"
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [confirm, setConfirm] = useState(null); // { type, id, email }
  const [toast, setToast] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const LIMIT = 15;

  // ── data fetching ───────────────────────────────────────────────────────

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/admin/subscribers?page=${page}&limit=${LIMIT}`,
        { headers: getAuthHeaders() },
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch");
      setSubscribers(data.subscribers);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // ── toast helper ────────────────────────────────────────────────────────

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── actions ─────────────────────────────────────────────────────────────

  const handleUnsubscribe = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/subscribers/${id}/unsubscribe`,
        { method: "PUT", headers: getAuthHeaders() },
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast("Subscriber marked as unsubscribed.");
      fetchSubscribers();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setConfirm(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/subscribers/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast("Subscriber deleted.");
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      fetchSubscribers();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setConfirm(null);
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await fetch(`${API_URL}/api/admin/subscribers/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    }
    showToast(`${selectedIds.size} subscriber(s) deleted.`);
    setSelectedIds(new Set());
    fetchSubscribers();
    setConfirm(null);
  };

  // ── CSV export ───────────────────────────────────────────────────────────

  const exportCSV = () => {
    const visible = filtered;
    const header = "email,status,subscribed_at\n";
    const rows = visible
      .map(
        (s) =>
          `${s.email},${s.is_active ? "active" : "inactive"},${s.created_at}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── selection helpers ────────────────────────────────────────────────────

  const toggleSelect = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  // ── client-side filter + search ──────────────────────────────────────────

  const filtered = subscribers.filter((s) => {
    const matchSearch = s.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterActive === "all"
        ? true
        : filterActive === "active"
          ? s.is_active
          : !s.is_active;
    return matchSearch && matchFilter;
  });

  // ── derived stats ────────────────────────────────────────────────────────

  const totalActive = subscribers.filter((s) => s.is_active).length;
  const totalInactive = subscribers.filter((s) => !s.is_active).length;

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div style={styles.container}>
      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Confirm Modal ── */}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onCancel={() => setConfirm(null)}
          onConfirm={confirm.onConfirm}
        />
      )}

      {/* ── Page Header ── */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>
            <Mail
              size={22}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            />
            Newsletter Subscribers
          </h2>
          <p style={styles.pageSubtitle}>
            Manage and monitor your subscriber list
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.btnSecondary} onClick={fetchSubscribers}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button style={styles.btnSecondary} onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Stat Pills ── */}
      <div style={styles.statRow}>
        <StatPill
          icon={Users}
          label="Total"
          value={pagination.total ?? subscribers.length}
          accent="#3b82f6"
        />
        <StatPill
          icon={CheckCircle}
          label="Active"
          value={totalActive}
          accent="#22c55e"
        />
        <StatPill
          icon={TrendingDown}
          label="Unsubscribed"
          value={totalInactive}
          accent="#f59e0b"
        />
        <StatPill
          icon={Calendar}
          label="Page"
          value={`${page} / ${pagination.pages || 1}`}
          accent="#8b5cf6"
        />
      </div>

      {/* ── Toolbar ── */}
      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <Search size={15} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search by email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={styles.filterGroup}>
          <Filter size={14} style={{ color: "var(--text-secondary)" }} />
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                ...(filterActive === f ? styles.filterBtnActive : {}),
              }}
              onClick={() => setFilterActive(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {selectedIds.size > 0 && (
          <button
            style={{ ...styles.btnDanger, marginLeft: "auto" }}
            onClick={() =>
              setConfirm({
                message: `Delete ${selectedIds.size} selected subscriber(s)? This cannot be undone.`,
                onConfirm: handleBulkDelete,
              })
            }
          >
            <Trash2 size={14} /> Delete ({selectedIds.size})
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.center}>
            <RefreshCw size={24} style={styles.spin} />
            <span style={{ marginLeft: 8, color: "var(--text-secondary)" }}>
              Loading subscribers…
            </span>
          </div>
        ) : error ? (
          <div style={{ ...styles.center, color: "#ef4444" }}>⚠ {error}</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <Mail size={40} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>No subscribers found.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size === filtered.length &&
                      filtered.length > 0
                    }
                    onChange={toggleAll}
                    style={styles.checkbox}
                  />
                </th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Subscribed</th>
                <th style={styles.th}>Updated</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => (
                <tr
                  key={sub.id}
                  style={{
                    ...styles.tr,
                    background: selectedIds.has(sub.id)
                      ? "var(--primary-bg)"
                      : i % 2 === 0
                        ? "transparent"
                        : "var(--bg-secondary)",
                  }}
                >
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(sub.id)}
                      onChange={() => toggleSelect(sub.id)}
                      style={styles.checkbox}
                    />
                  </td>
                  <td style={{ ...styles.td, ...styles.emailCell }}>
                    <Mail
                      size={13}
                      style={{ color: "var(--primary-color)", flexShrink: 0 }}
                    />
                    {sub.email}
                  </td>
                  <td style={styles.td}>
                    <Badge active={sub.is_active} />
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {fmtDate(sub.created_at)}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {fmtDate(sub.updated_at)}
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <div style={styles.actionGroup}>
                      {sub.is_active && (
                        <button
                          style={styles.actionBtn}
                          title="Unsubscribe"
                          onClick={() =>
                            setConfirm({
                              message: `Unsubscribe ${sub.email}?`,
                              onConfirm: () => handleUnsubscribe(sub.id),
                            })
                          }
                        >
                          <UserMinus size={15} />
                        </button>
                      )}
                      <button
                        style={{
                          ...styles.actionBtn,
                          ...styles.actionBtnDanger,
                        }}
                        title="Delete"
                        onClick={() =>
                          setConfirm({
                            message: `Permanently delete ${sub.email}?`,
                            onConfirm: () => handleDelete(sub.id),
                          })
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && pagination.pages > 1 && (
        <div style={styles.pagination}>
          <span style={styles.paginationInfo}>
            Showing {(page - 1) * LIMIT + 1}–
            {Math.min(page * LIMIT, pagination.total)} of {pagination.total}
          </span>
          <div style={styles.paginationBtns}>
            <button
              style={styles.pageBtn}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === pagination.pages || Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} style={styles.ellipsis}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    style={{
                      ...styles.pageBtn,
                      ...(p === page ? styles.pageBtnActive : {}),
                    }}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              style={styles.pageBtn}
              disabled={page === pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── inline styles (uses existing CSS variables) ─────────────────────────────

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    position: "relative",
  },

  // Toast
  toast: {
    position: "fixed",
    top: "1.25rem",
    right: "1.25rem",
    color: "#fff",
    padding: "0.75rem 1.25rem",
    borderRadius: 10,
    fontWeight: 500,
    fontSize: "0.9rem",
    zIndex: 9999,
    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    animation: "fadeIn 0.2s ease",
  },

  // Modal
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9000,
  },
  modal: {
    background: "var(--card-bg)",
    borderRadius: 14,
    padding: "2rem",
    maxWidth: 400,
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  modalMsg: {
    color: "var(--text-primary)",
    marginBottom: "1.5rem",
    lineHeight: 1.6,
  },
  modalActions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
  },

  // Header
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
  },
  pageTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  },
  pageSubtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    marginTop: 4,
  },
  headerActions: {
    display: "flex",
    gap: "0.625rem",
  },

  // Stat pills
  statRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  statPill: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    padding: "0.875rem 1.25rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flex: "1 1 140px",
  },
  statPillIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statPillValue: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    lineHeight: 1,
  },
  statPillLabel: {
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
    marginTop: 2,
  },

  // Toolbar
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  searchWrap: {
    position: "relative",
    flexGrow: 1,
    minWidth: 200,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-secondary)",
  },
  searchInput: {
    width: "100%",
    padding: "0.6rem 0.75rem 0.6rem 2.25rem",
    border: "1px solid var(--border-color)",
    borderRadius: 10,
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    background: "var(--bg-secondary)",
    borderRadius: 10,
    padding: "0.25rem",
  },
  filterBtn: {
    padding: "0.375rem 0.875rem",
    border: "none",
    borderRadius: 8,
    background: "transparent",
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.18s",
  },
  filterBtnActive: {
    background: "var(--card-bg)",
    color: "var(--primary-color)",
    fontWeight: 600,
    boxShadow: "0 1px 4px var(--shadow)",
  },

  // Table
  tableWrap: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 16,
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "var(--bg-secondary)",
  },
  th: {
    padding: "0.875rem 1rem",
    textAlign: "left",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    borderBottom: "1px solid var(--border-color)",
  },
  tr: {
    transition: "background 0.15s",
  },
  td: {
    padding: "0.8rem 1rem",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    borderBottom: "1px solid var(--border-color)",
    verticalAlign: "middle",
  },
  emailCell: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 500,
  },
  checkbox: {
    width: 16,
    height: 16,
    cursor: "pointer",
    accentColor: "var(--primary-color)",
  },

  // Badge
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "0.2rem 0.6rem",
    borderRadius: 20,
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  badgeActive: {
    background: "#dcfce7",
    color: "#16a34a",
  },
  badgeInactive: {
    background: "#fef9c3",
    color: "#a16207",
  },

  // Actions
  actionGroup: {
    display: "flex",
    gap: 6,
    justifyContent: "flex-end",
  },
  actionBtn: {
    padding: "0.4rem",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    background: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.18s",
  },
  actionBtnDanger: {
    color: "#ef4444",
    borderColor: "#fecaca",
    background: "#fef2f2",
  },

  // Buttons
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "0.55rem 1rem",
    border: "1px solid var(--border-color)",
    borderRadius: 10,
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.18s",
  },
  btnDanger: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "0.55rem 1rem",
    border: "1px solid #fecaca",
    borderRadius: 10,
    background: "#fef2f2",
    color: "#ef4444",
    fontSize: "0.875rem",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.18s",
  },

  // Pagination
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  paginationInfo: {
    fontSize: "0.875rem",
    color: "var(--text-secondary)",
  },
  paginationBtns: {
    display: "flex",
    gap: 4,
    alignItems: "center",
  },
  pageBtn: {
    minWidth: 34,
    height: 34,
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.18s",
  },
  pageBtnActive: {
    background: "var(--primary-color)",
    color: "#fff",
    borderColor: "var(--primary-color)",
    fontWeight: 700,
  },
  ellipsis: {
    padding: "0 4px",
    color: "var(--text-secondary)",
  },

  // Misc
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    color: "var(--text-secondary)",
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "var(--text-secondary)",
  },
  spin: {
    animation: "spin 1s linear infinite",
  },
};

export default SubscribersManagement;
