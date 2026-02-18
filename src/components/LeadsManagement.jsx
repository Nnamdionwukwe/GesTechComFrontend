// src/components/admin/LeadsManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import styles from "./LeadsManagement.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'details', 'status', 'notes'
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  // Form states
  const [statusUpdate, setStatusUpdate] = useState({ status: "", notes: "" });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [statusFilter, serviceFilter, searchTerm, pagination.page]);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (statusFilter) queryParams.append("status", statusFilter);
      if (serviceFilter) queryParams.append("service", serviceFilter);
      if (searchTerm) queryParams.append("search", searchTerm);

      const response = await fetch(
        `${API_URL}/api/contact/admin/leads?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setLeads(data.data.leads);
        setPagination((prev) => ({
          ...prev,
          total: data.data.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/contact/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data.overview);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/contact/admin/leads/${selectedLead.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(statusUpdate),
        },
      );

      const data = await response.json();
      if (data.success) {
        alert("Status updated successfully!");
        fetchLeads();
        setShowModal(false);
        setStatusUpdate({ status: "", notes: "" });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  const handleAddNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/contact/admin/leads/${selectedLead.id}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes }),
        },
      );

      const data = await response.json();
      if (data.success) {
        alert("Notes added successfully!");
        fetchLeads();
        setShowModal(false);
        setNotes("");
      }
    } catch (error) {
      console.error("Failed to add notes:", error);
      alert("Failed to add notes");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/contact/admin/leads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert("Lead deleted successfully!");
        fetchLeads();
      }
    } catch (error) {
      console.error("Failed to delete lead:", error);
      alert("Failed to delete lead");
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();

      if (statusFilter) queryParams.append("status", statusFilter);
      if (serviceFilter) queryParams.append("service", serviceFilter);

      const response = await fetch(
        `${API_URL}/api/contact/admin/leads-export?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Failed to export leads:", error);
      alert("Failed to export leads");
    }
  };

  const openModal = (type, lead) => {
    setSelectedLead(lead);
    setModalType(type);
    setShowModal(true);

    if (type === "status") {
      setStatusUpdate({ status: lead.status, notes: "" });
    }
    if (type === "notes") {
      setNotes(lead.notes || "");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { color: "#3B82F6", icon: Clock, text: "New" },
      contacted: { color: "#8B5CF6", icon: Phone, text: "Contacted" },
      qualified: { color: "#10B981", icon: CheckCircle, text: "Qualified" },
      proposal: { color: "#F59E0B", icon: FileText, text: "Proposal" },
      negotiation: { color: "#EF4444", icon: TrendingUp, text: "Negotiation" },
      won: { color: "#22C55E", icon: CheckCircle, text: "Won" },
      lost: { color: "#6B7280", icon: XCircle, text: "Lost" },
    };

    const badge = badges[status] || badges.new;
    const Icon = badge.icon;

    return (
      <span
        className={styles.statusBadge}
        style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
      >
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <RefreshCw className={styles.spinner} />
        <p>Loading leads...</p>
      </div>
    );
  }

  return (
    <div className={styles.leadsManagement}>
      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#3B82F620" }}
            >
              <Users size={24} style={{ color: "#3B82F6" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Leads</div>
              <div className={styles.statValue}>{stats.total_leads}</div>
              <div className={styles.statSubtext}>
                {stats.leads_last_7_days} in last 7 days
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#10B98120" }}
            >
              <CheckCircle size={24} style={{ color: "#10B981" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Qualified</div>
              <div className={styles.statValue}>{stats.qualified_leads}</div>
              <div className={styles.statSubtext}>Ready for proposal</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#22C55E20" }}
            >
              <TrendingUp size={24} style={{ color: "#22C55E" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Won</div>
              <div className={styles.statValue}>{stats.won_leads}</div>
              <div className={styles.statSubtext}>Converted to clients</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#F59E0B20" }}
            >
              <Clock size={24} style={{ color: "#F59E0B" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>New</div>
              <div className={styles.statValue}>{stats.new_leads}</div>
              <div className={styles.statSubtext}>Awaiting contact</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>

        <select
          className={styles.filterSelect}
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="">All Services</option>
          <option value="Software Development">Software Development</option>
          <option value="Mobile App Development">Mobile App Development</option>
          <option value="Web Development">Web Development</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Social Media Management">
            Social Media Management
          </option>
          <option value="Digital Marketing">Digital Marketing</option>
        </select>

        <button className={styles.exportButton} onClick={handleExport}>
          <Download size={20} />
          Export CSV
        </button>

        <button className={styles.refreshButton} onClick={() => fetchLeads()}>
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Leads Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Contact Info</th>
              <th>Service</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Source</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactName}>{lead.full_name}</div>
                    <div className={styles.contactDetails}>
                      <Mail size={14} />
                      {lead.email}
                    </div>
                    {lead.phone && (
                      <div className={styles.contactDetails}>
                        <Phone size={14} />
                        {lead.phone}
                      </div>
                    )}
                    {lead.company && (
                      <div className={styles.contactDetails}>
                        <Building size={14} />
                        {lead.company}
                      </div>
                    )}
                  </div>
                </td>
                <td>{lead.service_interest}</td>
                <td>{lead.budget_range || "Not specified"}</td>
                <td>{getStatusBadge(lead.status)}</td>
                <td>
                  <span className={styles.sourceBadge}>{lead.source}</span>
                </td>
                <td>
                  <div className={styles.dateInfo}>
                    <Calendar size={14} />
                    {formatDate(lead.created_at)}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => openModal("details", lead)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => openModal("status", lead)}
                      title="Update Status"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => openModal("notes", lead)}
                      title="Add Notes"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(lead.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <div className={styles.emptyState}>
            <Users size={48} />
            <p>No leads found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className={styles.pagination}>
          <button
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedLead && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                {modalType === "details" && "Lead Details"}
                {modalType === "status" && "Update Status"}
                {modalType === "notes" && "Add/Update Notes"}
              </h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className={styles.modalBody}>
              {modalType === "details" && (
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Name:</span>
                    <span>{selectedLead.full_name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span>{selectedLead.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Phone:</span>
                    <span>{selectedLead.phone || "N/A"}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Company:</span>
                    <span>{selectedLead.company || "N/A"}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Service:</span>
                    <span>{selectedLead.service_interest}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Budget:</span>
                    <span>{selectedLead.budget_range || "N/A"}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Status:</span>
                    {getStatusBadge(selectedLead.status)}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Source:</span>
                    <span>{selectedLead.source}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Created:</span>
                    <span>{formatDate(selectedLead.created_at)}</span>
                  </div>
                  <div className={styles.detailFull}>
                    <span className={styles.detailLabel}>Message:</span>
                    <p>{selectedLead.message}</p>
                  </div>
                  {selectedLead.notes && (
                    <div className={styles.detailFull}>
                      <span className={styles.detailLabel}>Notes:</span>
                      <p>{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {modalType === "status" && (
                <div className={styles.formContent}>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) =>
                        setStatusUpdate({
                          ...statusUpdate,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Notes (optional)</label>
                    <textarea
                      value={statusUpdate.notes}
                      onChange={(e) =>
                        setStatusUpdate({
                          ...statusUpdate,
                          notes: e.target.value,
                        })
                      }
                      rows="4"
                      placeholder="Add notes about this status change..."
                    />
                  </div>
                  <button
                    className={styles.submitBtn}
                    onClick={handleStatusUpdate}
                  >
                    Update Status
                  </button>
                </div>
              )}

              {modalType === "notes" && (
                <div className={styles.formContent}>
                  <div className={styles.formGroup}>
                    <label>Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="8"
                      placeholder="Add detailed notes about this lead..."
                    />
                  </div>
                  <button className={styles.submitBtn} onClick={handleAddNotes}>
                    Save Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManagement;
