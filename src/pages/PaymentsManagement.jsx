// src/components/admin/PaymentsManagement.jsx
import React, { useState, useEffect } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RotateCcw,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import styles from "./PaymentsManagement.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'details', 'verify', 'refund', 'status'
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  });

  // Refund form
  const [refundData, setRefundData] = useState({
    reason: "",
    amount: "",
  });

  // Status update form
  const [statusData, setStatusData] = useState({
    status: "",
    notes: "",
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [statusFilter, methodFilter, searchTerm, pagination.offset]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        limit: pagination.limit,
        offset: pagination.offset,
      });

      if (statusFilter) queryParams.append("status", statusFilter);
      if (methodFilter) queryParams.append("payment_method", methodFilter);
      if (searchTerm) queryParams.append("search", searchTerm);

      const response = await fetch(
        `${API_URL}/api/payments/admin/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setPayments(data.data.payments);
        setPagination((prev) => ({
          ...prev,
          total: data.data.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/payments/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleVerifyPayment = async (paymentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/payments/admin/${paymentId}/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        alert("Payment verified successfully!");
        fetchPayments();
        setShowModal(false);
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verify payment error:", error);
      alert("Failed to verify payment");
    }
  };

  const handleUpdateStatus = async (paymentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/payments/admin/${paymentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(statusData),
        },
      );

      const data = await response.json();
      if (data.success) {
        alert("Payment status updated successfully!");
        fetchPayments();
        setShowModal(false);
        setStatusData({ status: "", notes: "" });
      } else {
        alert(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update status");
    }
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm("Are you sure you want to process this refund?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/payments/admin/${paymentId}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(refundData),
        },
      );

      const data = await response.json();
      if (data.success) {
        alert("Refund processed successfully!");
        fetchPayments();
        fetchStats();
        setShowModal(false);
        setRefundData({ reason: "", amount: "" });
      } else {
        alert(data.error || "Refund failed");
      }
    } catch (error) {
      console.error("Refund error:", error);
      alert("Failed to process refund");
    }
  };

  const openModal = (type, payment) => {
    setSelectedPayment(payment);
    setModalType(type);
    setShowModal(true);

    if (type === "refund") {
      setRefundData({ reason: "", amount: payment.amount });
    }
    if (type === "status") {
      setStatusData({ status: payment.status, notes: "" });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { color: "#27ae60", icon: CheckCircle, text: "Completed" },
      pending: { color: "#f39c12", icon: Clock, text: "Pending" },
      failed: { color: "#e74c3c", icon: XCircle, text: "Failed" },
      refunded: { color: "#95a5a6", icon: RotateCcw, text: "Refunded" },
    };

    const badge = badges[status] || badges.pending;
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

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <RefreshCw className={styles.spinner} />
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className={styles.paymentsManagement}>
      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#3498db20" }}
            >
              <DollarSign size={24} style={{ color: "#3498db" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Revenue</div>
              <div className={styles.statValue}>
                {formatCurrency(stats.stats.total_revenue)}
              </div>
              <div className={styles.statSubtext}>
                {stats.stats.completed_payments} completed payments
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#27ae6020" }}
            >
              <CheckCircle size={24} style={{ color: "#27ae60" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Completed</div>
              <div className={styles.statValue}>
                {stats.stats.completed_payments}
              </div>
              <div className={styles.statSubtext}>
                Avg: {formatCurrency(stats.stats.average_payment_value)}
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#f39c1220" }}
            >
              <Clock size={24} style={{ color: "#f39c12" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Pending</div>
              <div className={styles.statValue}>
                {stats.stats.pending_payments}
              </div>
              <div className={styles.statSubtext}>Awaiting confirmation</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#e74c3c20" }}
            >
              <XCircle size={24} style={{ color: "#e74c3c" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Failed</div>
              <div className={styles.statValue}>
                {stats.stats.failed_payments}
              </div>
              <div className={styles.statSubtext}>
                {stats.stats.refunded_payments} refunded
              </div>
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
            placeholder="Search by order number, email, or reference..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          className={styles.filterSelect}
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="">All Methods</option>
          <option value="paystack">Paystack</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>

        <button
          className={styles.refreshButton}
          onClick={() => fetchPayments()}
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Payments Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <span className={styles.orderNumber}>
                    {payment.order_number}
                  </span>
                </td>
                <td>
                  <div className={styles.customerInfo}>
                    <div className={styles.customerName}>
                      {payment.user_name}
                    </div>
                    <div className={styles.customerEmail}>
                      {payment.user_email}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.amount}>
                    {formatCurrency(payment.amount)}
                  </span>
                </td>
                <td>
                  <span className={styles.methodBadge}>
                    {payment.payment_method === "paystack"
                      ? "Paystack"
                      : "Bank Transfer"}
                  </span>
                </td>
                <td>{getStatusBadge(payment.status)}</td>
                <td>
                  <span className={styles.date}>
                    {formatDate(payment.created_at)}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => openModal("details", payment)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>

                    {payment.status === "pending" &&
                      payment.payment_method === "paystack" && (
                        <button
                          className={`${styles.actionBtn} ${styles.verifyBtn}`}
                          onClick={() => openModal("verify", payment)}
                          title="Verify Payment"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                    {payment.status === "pending" && (
                      <button
                        className={`${styles.actionBtn} ${styles.statusBtn}`}
                        onClick={() => openModal("status", payment)}
                        title="Update Status"
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}

                    {payment.status === "completed" && (
                      <button
                        className={`${styles.actionBtn} ${styles.refundBtn}`}
                        onClick={() => openModal("refund", payment)}
                        title="Process Refund"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className={styles.emptyState}>
            <CreditCard size={48} />
            <p>No payments found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className={styles.pagination}>
          <button
            disabled={pagination.offset === 0}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                offset: Math.max(0, prev.offset - prev.limit),
              }))
            }
          >
            Previous
          </button>
          <span>
            Showing {pagination.offset + 1} -{" "}
            {Math.min(pagination.offset + pagination.limit, pagination.total)}{" "}
            of {pagination.total}
          </span>
          <button
            disabled={pagination.offset + pagination.limit >= pagination.total}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                offset: prev.offset + prev.limit,
              }))
            }
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedPayment && (
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
                {modalType === "details" && "Payment Details"}
                {modalType === "verify" && "Verify Payment"}
                {modalType === "status" && "Update Payment Status"}
                {modalType === "refund" && "Process Refund"}
              </h3>
              <button
                className={styles.closeModal}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {modalType === "details" && (
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Order Number:</span>
                    <span className={styles.detailValue}>
                      {selectedPayment.order_number}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Customer:</span>
                    <span className={styles.detailValue}>
                      {selectedPayment.user_name}
                      <br />
                      <small>{selectedPayment.user_email}</small>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Amount:</span>
                    <span className={styles.detailValue}>
                      {formatCurrency(selectedPayment.amount)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Payment Method:</span>
                    <span className={styles.detailValue}>
                      {selectedPayment.payment_method === "paystack"
                        ? "Paystack"
                        : "Bank Transfer"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Status:</span>
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                  {selectedPayment.transaction_reference && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Reference:</span>
                      <span className={styles.detailValue}>
                        {selectedPayment.transaction_reference}
                      </span>
                    </div>
                  )}
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Created:</span>
                    <span className={styles.detailValue}>
                      {formatDate(selectedPayment.created_at)}
                    </span>
                  </div>
                  {selectedPayment.paid_at && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Paid At:</span>
                      <span className={styles.detailValue}>
                        {formatDate(selectedPayment.paid_at)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {modalType === "verify" && (
                <div className={styles.verifyContent}>
                  <AlertCircle size={48} style={{ color: "#f39c12" }} />
                  <p>
                    Verify this Paystack payment? This will check the payment
                    status with Paystack and update accordingly.
                  </p>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.confirmBtn}
                      onClick={() => handleVerifyPayment(selectedPayment.id)}
                    >
                      Verify Payment
                    </button>
                  </div>
                </div>
              )}

              {modalType === "status" && (
                <div className={styles.formContent}>
                  <div className={styles.formGroup}>
                    <label>New Status</label>
                    <select
                      value={statusData.status}
                      onChange={(e) =>
                        setStatusData({ ...statusData, status: e.target.value })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Notes (Optional)</label>
                    <textarea
                      value={statusData.notes}
                      onChange={(e) =>
                        setStatusData({ ...statusData, notes: e.target.value })
                      }
                      placeholder="Add any notes about this status change..."
                      rows="4"
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.confirmBtn}
                      onClick={() => handleUpdateStatus(selectedPayment.id)}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              )}

              {modalType === "refund" && (
                <div className={styles.formContent}>
                  <div className={styles.refundWarning}>
                    <AlertCircle size={20} />
                    <p>
                      This will refund the payment and cancel the order. Stock
                      will be restored.
                    </p>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Refund Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={refundData.amount}
                      onChange={(e) =>
                        setRefundData({ ...refundData, amount: e.target.value })
                      }
                      placeholder="Enter refund amount"
                    />
                    <small>
                      Maximum: {formatCurrency(selectedPayment.amount)}
                    </small>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Refund Reason</label>
                    <textarea
                      value={refundData.reason}
                      onChange={(e) =>
                        setRefundData({ ...refundData, reason: e.target.value })
                      }
                      placeholder="Enter reason for refund..."
                      rows="4"
                      required
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`${styles.confirmBtn} ${styles.dangerBtn}`}
                      onClick={() => handleRefund(selectedPayment.id)}
                      disabled={!refundData.reason}
                    >
                      Process Refund
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
