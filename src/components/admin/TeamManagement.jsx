import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Loader,
  Linkedin,
  Twitter,
  Github,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";
import styles from "./TeamManagement.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Management",
  "Product",
  "Other",
];

const EMPTY_FORM = {
  full_name: "",
  position: "",
  department: "",
  bio: "",
  avatar: "",
  email: "",
  phone: "",
  linkedin_url: "",
  twitter_url: "",
  github_url: "",
  skills: "",
  is_leadership: false,
  is_active: true,
  display_order: 0,
};

// ── Helpers ───────────────────────────────────────────────────────────────
const token = () => localStorage.getItem("token");
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

const parseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  try {
    return JSON.parse(skills);
  } catch {
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
};

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

// ── Confirm Dialog ────────────────────────────────────────────────────────
const Confirm = ({ member, onConfirm, onCancel }) => (
  <div className={styles.overlay} onClick={onCancel}>
    <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
      <Trash2 size={32} className={styles.confirmIcon} />
      <h3>Delete Member?</h3>
      <p>
        Remove <strong>{member.full_name}</strong> from the team? This cannot be
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

// ── Member Modal ──────────────────────────────────────────────────────────
const MemberModal = ({ member, onClose, onSave, saving }) => {
  const [form, setForm] = useState(
    member
      ? { ...member, skills: parseSkills(member.skills).join(", ") }
      : { ...EMPTY_FORM },
  );

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.position.trim()) return;
    onSave({
      ...form,
      skills: form.skills
        ? form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      display_order: parseInt(form.display_order) || 0,
    });
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{member ? "Edit Team Member" : "Add Team Member"}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Basic Info</h4>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>
                  Full Name <span className={styles.req}>*</span>
                </label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={set}
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  Position <span className={styles.req}>*</span>
                </label>
                <input
                  name="position"
                  value={form.position}
                  onChange={set}
                  placeholder="Lead Developer"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={set}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Display Order</label>
                <input
                  name="display_order"
                  type="number"
                  value={form.display_order}
                  onChange={set}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Contact</h4>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={set}
                  placeholder="jane@company.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={set}
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Profile</h4>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Avatar URL</label>
                <input
                  name="avatar"
                  value={form.avatar}
                  onChange={set}
                  placeholder="https://..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <Linkedin size={13} /> LinkedIn
                </label>
                <input
                  name="linkedin_url"
                  value={form.linkedin_url}
                  onChange={set}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <Twitter size={13} /> Twitter
                </label>
                <input
                  name="twitter_url"
                  value={form.twitter_url}
                  onChange={set}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <Github size={13} /> GitHub
                </label>
                <input
                  name="github_url"
                  value={form.github_url}
                  onChange={set}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>
                  Skills <span className={styles.hint}>(comma-separated)</span>
                </label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={set}
                  placeholder="React, Node.js, PostgreSQL, Docker"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={set}
                  rows="3"
                  placeholder="Short professional bio..."
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Settings</h4>
            <div className={styles.toggleRow}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="is_leadership"
                  checked={form.is_leadership}
                  onChange={set}
                />
                <span className={styles.slider} />
                <span>Leadership Member</span>
              </label>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={set}
                />
                <span className={styles.slider} />
                <span>Active</span>
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
              {saving ? "Saving…" : member ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Member Card ───────────────────────────────────────────────────────────
const MemberCard = ({ member, onEdit, onDelete }) => {
  const skills = parseSkills(member.skills);
  return (
    <div
      className={`${styles.card} ${!member.is_active ? styles.cardInactive : ""}`}
    >
      <div className={styles.cardTop}>
        <div className={styles.avatar}>
          {member.avatar ? (
            <img src={member.avatar} alt={member.full_name} />
          ) : (
            <span>{member.full_name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className={styles.cardBadges}>
          {member.is_leadership && (
            <span className={styles.badgeLeadership}>
              <Star size={10} /> Leadership
            </span>
          )}
          <span
            className={
              member.is_active ? styles.badgeActive : styles.badgeInactive
            }
          >
            {member.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.memberName}>{member.full_name}</h3>
        <p className={styles.memberPosition}>{member.position}</p>
        {member.department && (
          <span className={styles.memberDept}>{member.department}</span>
        )}
        {member.email && <p className={styles.memberEmail}>{member.email}</p>}

        {skills.length > 0 && (
          <div className={styles.skills}>
            {skills.slice(0, 4).map((s, i) => (
              <span key={i} className={styles.skillTag}>
                {s}
              </span>
            ))}
            {skills.length > 4 && (
              <span className={styles.skillMore}>+{skills.length - 4}</span>
            )}
          </div>
        )}

        <div className={styles.socials}>
          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className={styles.social}
            >
              <Linkedin size={14} />
            </a>
          )}
          {member.twitter_url && (
            <a
              href={member.twitter_url}
              target="_blank"
              rel="noreferrer"
              className={styles.social}
            >
              <Twitter size={14} />
            </a>
          )}
          {member.github_url && (
            <a
              href={member.github_url}
              target="_blank"
              rel="noreferrer"
              className={styles.social}
            >
              <Github size={14} />
            </a>
          )}
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.editBtn} onClick={() => onEdit(member)}>
          <Edit2 size={14} /> Edit
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(member)}>
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast, setToast] = useState(null);
  const LIMIT = 12;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(filterDept && { department: filterDept }),
        ...(filterActive !== "" && { is_active: filterActive }),
        ...(search && { search }),
      });
      const res = await fetch(`${API_URL}/api/admin/team?${params}`, {
        headers: headers(),
      });
      const data = await res.json();
      if (data.success) {
        setMembers(data.data?.members || data.members || []);
        setPagination(data.data?.pagination || data.pagination || {});
      }
    } catch {
      showToast("Failed to load team members", "error");
    } finally {
      setLoading(false);
    }
  }, [page, filterDept, filterActive, search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const isEdit = !!editMember;
      const url = isEdit
        ? `${API_URL}/api/admin/team/${editMember.id}`
        : `${API_URL}/api/admin/team`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: headers(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Member updated!" : "Member added!");
        setShowModal(false);
        setEditMember(null);
        fetchMembers();
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
      const res = await fetch(`${API_URL}/api/admin/team/${confirmDel.id}`, {
        method: "DELETE",
        headers: headers(),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Member removed");
        setConfirmDel(null);
        fetchMembers();
      } else {
        showToast(data.error || "Delete failed", "error");
      }
    } catch {
      showToast("Connection error", "error");
    }
  };

  const openEdit = (member) => {
    setEditMember(member);
    setShowModal(true);
  };
  const openAdd = () => {
    setEditMember(null);
    setShowModal(true);
  };

  const totalPages = pagination.pages || 1;

  return (
    <div className={styles.page}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <div className={styles.pageTitleIcon}>
            <Users size={22} />
          </div>
          <div>
            <h1>Team Members</h1>
            <p>{pagination.total ?? members.length} members total</p>
          </div>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          <Plus size={18} /> Add Member
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by name, position, email…"
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
            value={filterDept}
            onChange={(e) => {
              setFilterDept(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filterActive}
            onChange={(e) => {
              setFilterActive(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.loadingState}>
          <Loader size={32} className={styles.spin} />
          <p>Loading team members…</p>
        </div>
      ) : members.length === 0 ? (
        <div className={styles.emptyState}>
          <Users size={48} />
          <h3>No team members found</h3>
          <p>Add your first team member to get started.</p>
          <button className={styles.addBtn} onClick={openAdd}>
            <Plus size={16} /> Add Member
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
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
        <MemberModal
          member={editMember}
          onClose={() => {
            setShowModal(false);
            setEditMember(null);
          }}
          onSave={handleSave}
          saving={saving}
        />
      )}
      {confirmDel && (
        <Confirm
          member={confirmDel}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDel(null)}
        />
      )}
    </div>
  );
};

export default TeamManagement;
