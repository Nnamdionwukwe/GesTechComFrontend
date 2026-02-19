// src/components/admin/UsersManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Trash2,
  ShieldCheck,
  ShieldOff,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Crown,
  Edit3,
  X,
  Save,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Clock,
  AlertTriangle,
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

const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

const ROLE_CONFIG = {
  admin: { label: "Admin", color: "#ef4444", bg: "#fef2f2", icon: Crown },
  editor: { label: "Editor", color: "#8b5cf6", bg: "#f5f3ff", icon: Edit3 },
  user: { label: "User", color: "#3b82f6", bg: "#eff6ff", icon: Users },
};

// ─── sub-components ─────────────────────────────────────────────────────────

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "0.2rem 0.65rem",
        borderRadius: 20,
        fontSize: "0.75rem",
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        textTransform: "capitalize",
      }}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

const StatusBadge = ({ active }) =>
  active ? (
    <span style={{ ...s.badge, background: "#dcfce7", color: "#16a34a" }}>
      <UserCheck size={11} /> Active
    </span>
  ) : (
    <span style={{ ...s.badge, background: "#fee2e2", color: "#dc2626" }}>
      <UserX size={11} /> Inactive
    </span>
  );

const Avatar = ({ name, avatar, size = 36 }) => {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
  ];
  const color = colors[name?.charCodeAt(0) % colors.length] || "#6b7280";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color + "22",
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.35,
        flexShrink: 0,
        border: `2px solid ${color}33`,
      }}
    >
      {initials}
    </div>
  );
};

const ConfirmModal = ({
  title,
  message,
  danger = true,
  onConfirm,
  onCancel,
}) => (
  <div style={s.backdrop}>
    <div style={s.modal}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1rem",
        }}
      >
        {danger && <AlertTriangle size={20} color="#ef4444" />}
        <h3
          style={{
            margin: 0,
            color: "var(--text-primary)",
            fontSize: "1.1rem",
          }}
        >
          {title}
        </h3>
      </div>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "1.5rem",
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>
      <div
        style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}
      >
        <button style={s.btnSecondary} onClick={onCancel}>
          Cancel
        </button>
        <button
          style={{
            ...s.btnDanger,
            ...(danger
              ? {}
              : {
                  background: "#eff6ff",
                  color: "#3b82f6",
                  borderColor: "#bfdbfe",
                }),
          }}
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const EditRoleModal = ({ user, onSave, onCancel, loading }) => {
  const [role, setRole] = useState(user.role);
  return (
    <div style={s.backdrop}>
      <div style={s.modal}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={user.full_name} avatar={user.avatar} size={40} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                {user.full_name}
              </div>
              <div
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                {user.email}
              </div>
            </div>
          </div>
          <button style={s.iconBtn} onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <label style={s.label}>Change Role</label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: "1.5rem",
          }}
        >
          {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  cursor: "pointer",
                  border: `2px solid ${role === key ? cfg.color : "var(--border-color)"}`,
                  background: role === key ? cfg.bg : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value={key}
                  checked={role === key}
                  onChange={() => setRole(key)}
                  style={{ accentColor: cfg.color }}
                />
                <Icon size={16} style={{ color: cfg.color }} />
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: cfg.color,
                      fontSize: "0.9rem",
                    }}
                  >
                    {cfg.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {key === "admin" && "Full access to all admin features"}
                    {key === "editor" && "Can manage content but not users"}
                    {key === "user" && "Standard user access"}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <button style={s.btnSecondary} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }}
            onClick={() => onSave(user.id, role)}
            disabled={loading}
          >
            <Save size={15} /> {loading ? "Saving…" : "Save Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserDetailPanel = ({ user, onClose, onToggleStatus, onEditRole }) => (
  <div style={s.detailPanel}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1.5rem",
      }}
    >
      <h3
        style={{ margin: 0, color: "var(--text-primary)", fontSize: "1.1rem" }}
      >
        User Details
      </h3>
      <button style={s.iconBtn} onClick={onClose}>
        <X size={18} />
      </button>
    </div>

    <div
      style={{
        textAlign: "center",
        marginBottom: "1.5rem",
        padding: "1.25rem",
        background: "var(--bg-secondary)",
        borderRadius: 12,
      }}
    >
      <Avatar name={user.full_name} avatar={user.avatar} size={64} />
      <div
        style={{
          marginTop: 12,
          fontWeight: 700,
          fontSize: "1.1rem",
          color: "var(--text-primary)",
        }}
      >
        {user.full_name}
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
          marginTop: 4,
        }}
      >
        {user.email}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 10,
        }}
      >
        <RoleBadge role={user.role} />
        <StatusBadge active={user.is_active} />
      </div>
    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: "1.5rem",
      }}
    >
      {[
        { icon: Mail, label: "Email", value: user.email },
        { icon: Phone, label: "Phone", value: user.phone || "Not provided" },
        { icon: Calendar, label: "Joined", value: fmtDate(user.created_at) },
        {
          icon: Clock,
          label: "Last Login",
          value: fmtDateTime(user.last_login),
        },
      ].map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={15} style={{ color: "var(--text-secondary)" }} />
          </div>
          <div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              {value}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button style={s.btnPrimary} onClick={() => onEditRole(user)}>
        <Edit3 size={15} /> Change Role
      </button>
      <button
        style={
          user.is_active
            ? s.btnWarning
            : { ...s.btnSecondary, color: "#16a34a", borderColor: "#86efac" }
        }
        onClick={() => onToggleStatus(user)}
      >
        {user.is_active ? (
          <>
            <ShieldOff size={15} /> Deactivate User
          </>
        ) : (
          <>
            <ShieldCheck size={15} /> Activate User
          </>
        )}
      </button>
    </div>
  </div>
);

// ─── main component ──────────────────────────────────────────────────────────

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRoleUser, setEditRoleUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const LIMIT = 12;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (roleFilter !== "all") params.append("role", roleFilter);
      const res = await fetch(`${API_URL}/api/auth/users?${params}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch users");
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // ── actions ─────────────────────────────────────────────────────────────

  const handleToggleStatus = async (user) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/auth/users/${user.id}/toggle-status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        },
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(
        `User ${data.user.is_active ? "activated" : "deactivated"} successfully.`,
      );
      fetchUsers();
      if (selectedUser?.id === user.id) setSelectedUser(data.user);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  const handleUpdateRole = async (id, role) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/users/${id}/role`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(`Role updated to "${role}" successfully.`);
      fetchUsers();
      if (selectedUser?.id === id) setSelectedUser({ ...selectedUser, role });
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
      setEditRoleUser(null);
    }
  };

  // ── client-side filter ───────────────────────────────────────────────────

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? u.is_active
          : !u.is_active;
    return matchSearch && matchStatus;
  });

  // ── stats ────────────────────────────────────────────────────────────────

  const totalActive = users.filter((u) => u.is_active).length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <div style={{ display: "flex", gap: "1.5rem", position: "relative" }}>
      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            ...s.toast,
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Modals ── */}
      {confirm && (
        <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />
      )}
      {editRoleUser && (
        <EditRoleModal
          user={editRoleUser}
          loading={actionLoading}
          onSave={handleUpdateRole}
          onCancel={() => setEditRoleUser(null)}
        />
      )}

      {/* ── Main Panel ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Users size={22} /> User Management
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginTop: 4,
              }}
            >
              Manage roles, status, and access for all registered users
            </p>
          </div>
          <button style={s.btnSecondary} onClick={fetchUsers}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Stat Pills */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            {
              label: "Total Users",
              value: pagination.total ?? users.length,
              color: "#3b82f6",
            },
            { label: "Active", value: totalActive, color: "#22c55e" },
            {
              label: "Inactive",
              value: users.length - totalActive,
              color: "#f59e0b",
            },
            { label: "Admins", value: totalAdmins, color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ ...s.statPill, flex: "1 1 120px" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color }}>
                {value}
              </div>
              <div
                style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flexGrow: 1, minWidth: 200 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
              }}
            />
            <input
              style={s.searchInput}
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Role filter */}
          <div style={s.filterGroup}>
            <Filter size={13} style={{ color: "var(--text-secondary)" }} />
            {["all", "admin", "editor", "user"].map((r) => (
              <button
                key={r}
                style={{
                  ...s.filterBtn,
                  ...(roleFilter === r ? s.filterBtnActive : {}),
                }}
                onClick={() => {
                  setRoleFilter(r);
                  setPage(1);
                }}
              >
                {r === "all" ? "All Roles" : ROLE_CONFIG[r]?.label || r}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div style={s.filterGroup}>
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                style={{
                  ...s.filterBtn,
                  ...(statusFilter === f ? s.filterBtnActive : {}),
                }}
                onClick={() => setStatusFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={s.tableWrap}>
          {loading ? (
            <div style={s.center}>
              <RefreshCw
                size={22}
                style={{ animation: "spin 1s linear infinite" }}
              />
              <span style={{ marginLeft: 8, color: "var(--text-secondary)" }}>
                Loading users…
              </span>
            </div>
          ) : error ? (
            <div style={{ ...s.center, color: "#ef4444" }}>⚠ {error}</div>
          ) : filtered.length === 0 ? (
            <div style={{ ...s.center, flexDirection: "column", gap: 8 }}>
              <Users size={40} style={{ opacity: 0.25 }} />
              <p style={{ color: "var(--text-secondary)" }}>No users found.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {[
                    "User",
                    "Role",
                    "Status",
                    "Joined",
                    "Last Login",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      style={{ ...s.th, textAlign: i === 5 ? "right" : "left" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    style={{
                      background:
                        selectedUser?.id === user.id
                          ? "var(--primary-bg)"
                          : i % 2 === 0
                            ? "transparent"
                            : "var(--bg-secondary)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onClick={() =>
                      setSelectedUser(
                        selectedUser?.id === user.id ? null : user,
                      )
                    }
                  >
                    <td style={s.td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Avatar
                          name={user.full_name}
                          avatar={user.avatar}
                          size={36}
                        />
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              fontSize: "0.9rem",
                            }}
                          >
                            {user.full_name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <RoleBadge role={user.role} />
                    </td>
                    <td style={s.td}>
                      <StatusBadge active={user.is_active} />
                    </td>
                    <td
                      style={{
                        ...s.td,
                        color: "var(--text-secondary)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {fmtDate(user.created_at)}
                    </td>
                    <td
                      style={{
                        ...s.td,
                        color: "var(--text-secondary)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {fmtDateTime(user.last_login)}
                    </td>
                    <td style={{ ...s.td, textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          justifyContent: "flex-end",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          style={s.actionBtn}
                          title="Change Role"
                          onClick={() => setEditRoleUser(user)}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          style={{
                            ...s.actionBtn,
                            color: user.is_active ? "#f59e0b" : "#22c55e",
                            borderColor: user.is_active ? "#fde68a" : "#86efac",
                          }}
                          title={user.is_active ? "Deactivate" : "Activate"}
                          onClick={() =>
                            setConfirm({
                              title: user.is_active
                                ? "Deactivate User"
                                : "Activate User",
                              message: `${user.is_active ? "Deactivate" : "Activate"} ${user.full_name}? They will ${user.is_active ? "lose" : "regain"} access to the platform.`,
                              danger: user.is_active,
                              onConfirm: () => handleToggleStatus(user),
                            })
                          }
                        >
                          {user.is_active ? (
                            <ShieldOff size={14} />
                          ) : (
                            <ShieldCheck size={14} />
                          )}
                        </button>
                        <button
                          style={s.actionBtn}
                          title="View Details"
                          onClick={() =>
                            setSelectedUser(
                              selectedUser?.id === user.id ? null : user,
                            )
                          }
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <span
              style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
            >
              Showing {(page - 1) * LIMIT + 1}–
              {Math.min(page * LIMIT, pagination.total)} of {pagination.total}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                style={s.pageBtn}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.pages ||
                    Math.abs(p - page) <= 1,
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`e-${i}`}
                      style={{
                        padding: "0 4px",
                        color: "var(--text-secondary)",
                        lineHeight: "34px",
                      }}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      style={{
                        ...s.pageBtn,
                        ...(p === page
                          ? {
                              background: "var(--primary-color)",
                              color: "#fff",
                              borderColor: "var(--primary-color)",
                              fontWeight: 700,
                            }
                          : {}),
                      }}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}
              <button
                style={s.pageBtn}
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail Side Panel ── */}
      {selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggleStatus={(user) =>
            setConfirm({
              title: user.is_active ? "Deactivate User" : "Activate User",
              message: `${user.is_active ? "Deactivate" : "Activate"} ${user.full_name}?`,
              danger: user.is_active,
              onConfirm: () => handleToggleStatus(user),
            })
          }
          onEditRole={(user) => setEditRoleUser(user)}
        />
      )}
    </div>
  );
};

// ─── styles ──────────────────────────────────────────────────────────────────

const s = {
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
  },
  backdrop: {
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
    borderRadius: 16,
    padding: "2rem",
    maxWidth: 460,
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  detailPanel: {
    width: 300,
    flexShrink: 0,
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 16,
    padding: "1.5rem",
    alignSelf: "flex-start",
    position: "sticky",
    top: 80,
  },
  statPill: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    padding: "0.875rem 1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  tableWrap: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 16,
    overflow: "hidden",
  },
  th: {
    padding: "0.875rem 1rem",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    borderBottom: "1px solid var(--border-color)",
  },
  td: {
    padding: "0.85rem 1rem",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    borderBottom: "1px solid var(--border-color)",
    verticalAlign: "middle",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "0.2rem 0.6rem",
    borderRadius: 20,
    fontSize: "0.75rem",
    fontWeight: 600,
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
  iconBtn: {
    padding: "0.4rem",
    border: "none",
    background: "var(--bg-secondary)",
    borderRadius: 8,
    color: "var(--text-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
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
    gap: "0.25rem",
    background: "var(--bg-secondary)",
    borderRadius: 10,
    padding: "0.25rem",
  },
  filterBtn: {
    padding: "0.35rem 0.75rem",
    border: "none",
    borderRadius: 8,
    background: "transparent",
    color: "var(--text-secondary)",
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  filterBtnActive: {
    background: "var(--card-bg)",
    color: "var(--primary-color)",
    fontWeight: 600,
    boxShadow: "0 1px 4px var(--shadow)",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "0.6rem 1.1rem",
    border: "none",
    borderRadius: 10,
    background: "var(--primary-color)",
    color: "#fff",
    fontSize: "0.875rem",
    cursor: "pointer",
    fontWeight: 600,
    width: "100%",
    justifyContent: "center",
  },
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
  },
  btnWarning: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "0.6rem 1.1rem",
    border: "1px solid #fde68a",
    borderRadius: 10,
    background: "#fffbeb",
    color: "#d97706",
    fontSize: "0.875rem",
    cursor: "pointer",
    fontWeight: 600,
    width: "100%",
    justifyContent: "center",
    marginTop: 8,
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
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: 8,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    color: "var(--text-secondary)",
  },
};

export default UsersManagement;
