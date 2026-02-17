import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import styles from "./Orderdetails.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data.order);
        setItems(data.data.items);
        setPayment(data.data.payment);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTimeline = () => {
    if (!order) return [];

    const timeline = [
      {
        status: "pending",
        label: "Order Placed",
        icon: CheckCircle2,
        date: order.created_at,
      },
      { status: "processing", label: "Processing", icon: Package },
      { status: "shipped", label: "Shipped", icon: Truck },
      { status: "delivered", label: "Delivered", icon: CheckCircle2 },
    ];

    const currentIndex = timeline.findIndex(
      (t) => t.status === order.order_status,
    );

    return timeline.map((item, index) => ({
      ...item,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>{error || "Order not found"}</p>
          <Link to="/orders" className={styles.backLink}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const timeline = getStatusTimeline();

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <ChevronRight size={16} />
            <Link to="/orders">Orders</Link>
            <ChevronRight size={16} />
            <span>{order.order_number}</span>
          </div>

          <Link to="/orders" className={styles.backBtn}>
            <ArrowLeft size={20} />
            Back to Orders
          </Link>

          <div className={styles.titleSection}>
            <h1 className={styles.title}>Order #{order.order_number}</h1>
            <span
              className={`${styles.statusBadge} ${styles[order.order_status]}`}
            >
              {order.order_status.charAt(0).toUpperCase() +
                order.order_status.slice(1)}
            </span>
          </div>

          <p className={styles.orderDate}>
            <Calendar size={16} />
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          {/* Order Timeline */}
          {order.order_status !== "cancelled" && (
            <div className={styles.timeline}>
              {timeline.map((step, index) => (
                <div
                  key={step.status}
                  className={`${styles.timelineStep} ${step.completed ? styles.completed : ""} ${step.active ? styles.active : ""}`}
                >
                  <div className={styles.timelineIcon}>
                    <step.icon size={20} />
                  </div>
                  <div className={styles.timelineContent}>
                    <h4>{step.label}</h4>
                    <p>{step.date ? formatDate(step.date) : "Pending"}</p>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={styles.timelineLine}></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {order.order_status === "cancelled" && (
            <div className={styles.cancelledBanner}>
              <XCircle size={24} />
              <div>
                <strong>This order has been cancelled</strong>
                <p>If you have any questions, please contact support</p>
              </div>
            </div>
          )}

          <div className={styles.contentGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Order Items */}
              <div className={styles.card}>
                <h2>
                  <Package size={24} />
                  Order Items
                </h2>

                <div className={styles.items}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemImage}>
                        {item.product_images?.[0] ? (
                          <img
                            src={item.product_images[0]}
                            alt={item.product_name}
                          />
                        ) : (
                          <Package size={32} />
                        )}
                      </div>
                      <div className={styles.itemDetails}>
                        <h4>{item.product_name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <span className={styles.itemPrice}>
                          ${item.price.toFixed(2)} each
                        </span>
                      </div>
                      <div className={styles.itemTotal}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderSummary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.shipping_cost > 0 && (
                    <div className={styles.summaryRow}>
                      <span>Shipping</span>
                      <span>${order.shipping_cost.toFixed(2)}</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className={styles.summaryRow}>
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Shipping Address */}
              <div className={styles.card}>
                <h3>
                  <MapPin size={20} />
                  Shipping Address
                </h3>
                <div className={styles.address}>
                  <p>
                    <strong>{order.shipping_address}</strong>
                  </p>
                  <p>
                    {order.shipping_city}, {order.shipping_state}
                  </p>
                  {order.shipping_postal_code && (
                    <p>{order.shipping_postal_code}</p>
                  )}
                  <p>{order.shipping_country}</p>
                  {order.shipping_phone && (
                    <p className={styles.contactInfo}>
                      <Phone size={14} />
                      {order.shipping_phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className={styles.card}>
                <h3>
                  <CreditCard size={20} />
                  Payment Information
                </h3>
                <div className={styles.paymentInfo}>
                  <div className={styles.infoRow}>
                    <span>Method:</span>
                    <strong>
                      {order.payment_method === "paystack"
                        ? "Card Payment"
                        : "Bank Transfer"}
                    </strong>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Status:</span>
                    <span
                      className={`${styles.paymentBadge} ${styles[order.payment_status]}`}
                    >
                      {order.payment_status.charAt(0).toUpperCase() +
                        order.payment_status.slice(1)}
                    </span>
                  </div>
                  {payment?.paid_at && (
                    <div className={styles.infoRow}>
                      <span>Paid on:</span>
                      <strong>{formatDate(payment.paid_at)}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Information */}
              {order.tracking_number && (
                <div className={styles.card}>
                  <h3>
                    <Truck size={20} />
                    Tracking Information
                  </h3>
                  <div className={styles.trackingInfo}>
                    <p>Tracking Number:</p>
                    <span className={styles.trackingNumber}>
                      {order.tracking_number}
                    </span>
                  </div>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className={styles.card}>
                  <h3>Order Notes</h3>
                  <p className={styles.notes}>{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;
