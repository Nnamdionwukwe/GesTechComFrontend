import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  DollarSign,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import styles from "./Orders.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [filter, pagination.offset]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const params = new URLSearchParams({
        limit: pagination.limit,
        offset: pagination.offset,
      });

      if (filter !== "all") {
        params.append("status", filter);
      }

      const response = await fetch(`${API_URL}/api/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={18} />;
      case "processing":
        return <Package size={18} />;
      case "shipped":
        return <Truck size={18} />;
      case "delivered":
        return <CheckCircle2 size={18} />;
      case "cancelled":
        return <XCircle size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return styles.pending;
      case "processing":
        return styles.processing;
      case "shipped":
        return styles.shipped;
      case "delivered":
        return styles.delivered;
      case "cancelled":
        return styles.cancelled;
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (searchQuery) {
      return order.order_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const statusFilters = [
    { id: "all", label: "All Orders", count: pagination.total },
    { id: "pending", label: "Pending", icon: Clock },
    { id: "processing", label: "Processing", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
    { id: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <ChevronRight size={16} />
            <span>My Orders</span>
          </div>

          <h1 className={styles.title}>
            <ShoppingBag size={32} />
            My Orders
          </h1>

          <p className={styles.subtitle}>Track and manage your orders</p>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <div className={styles.container}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          {/* Filters */}
          <div className={styles.filtersSection}>
            <div className={styles.searchBar}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.statusFilters}>
              {statusFilters.map((filterItem) => (
                <button
                  key={filterItem.id}
                  className={`${styles.filterBtn} ${filter === filterItem.id ? styles.active : ""}`}
                  onClick={() => {
                    setFilter(filterItem.id);
                    setPagination({ ...pagination, offset: 0 });
                  }}
                >
                  {filterItem.icon && <filterItem.icon size={18} />}
                  {filterItem.label}
                  {filterItem.count && filter === "all" && (
                    <span className={styles.count}>{filterItem.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Package size={64} />
              </div>
              <h2>No orders found</h2>
              <p>
                {searchQuery
                  ? "No orders match your search"
                  : filter !== "all"
                    ? `You don't have any ${filter} orders`
                    : "You haven't placed any orders yet"}
              </p>
              {!searchQuery && filter === "all" && (
                <Link to="/shop" className={styles.shopBtn}>
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <div className={styles.ordersList}>
              {filteredOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3>Order #{order.order_number}</h3>
                      <div className={styles.orderMeta}>
                        <span>
                          <Calendar size={14} />
                          {formatDate(order.created_at)}
                        </span>
                        <span>
                          <Package size={14} />
                          {order.item_count}{" "}
                          {order.item_count === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.orderActions}>
                      <span
                        className={`${styles.statusBadge} ${getStatusColor(order.order_status)}`}
                      >
                        {getStatusIcon(order.order_status)}
                        {order.order_status.charAt(0).toUpperCase() +
                          order.order_status.slice(1)}
                      </span>
                      <Link
                        to={`/orders/${order.id}`}
                        className={styles.viewBtn}
                      >
                        <Eye size={18} />
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className={styles.orderBody}>
                    <div className={styles.orderDetail}>
                      <span className={styles.label}>Payment Status:</span>
                      <span
                        className={`${styles.paymentBadge} ${styles[order.payment_status]}`}
                      >
                        {order.payment_status.charAt(0).toUpperCase() +
                          order.payment_status.slice(1)}
                      </span>
                    </div>

                    <div className={styles.orderDetail}>
                      <span className={styles.label}>Payment Method:</span>
                      <span>
                        {order.payment_method === "paystack"
                          ? "Card Payment"
                          : "Bank Transfer"}
                      </span>
                    </div>

                    {order.tracking_number && (
                      <div className={styles.orderDetail}>
                        <span className={styles.label}>Tracking Number:</span>
                        <span className={styles.tracking}>
                          {order.tracking_number}
                        </span>
                      </div>
                    )}

                    <div className={styles.orderTotal}>
                      <span className={styles.totalAmount}>
                        ₦{parseFloat(order.total).toLocaleString()}.00
                      </span>
                    </div>
                  </div>

                  {order.order_status === "pending" && (
                    <div className={styles.orderFooter}>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to cancel this order?",
                            )
                          ) {
                            // Handle cancel order
                          }
                        }}
                      >
                        <XCircle size={16} />
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className={styles.pagination}>
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    offset: Math.max(0, pagination.offset - pagination.limit),
                  })
                }
                disabled={pagination.offset === 0}
                className={styles.pageBtn}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Showing {pagination.offset + 1} -{" "}
                {Math.min(
                  pagination.offset + pagination.limit,
                  pagination.total,
                )}{" "}
                of {pagination.total}
              </span>
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    offset: pagination.offset + pagination.limit,
                  })
                }
                disabled={
                  pagination.offset + pagination.limit >= pagination.total
                }
                className={styles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Orders;
