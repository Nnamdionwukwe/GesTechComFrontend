import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import {
  CheckCircle2,
  Copy,
  Building2,
  FileText,
  Clock,
  ArrowRight,
  Package,
  AlertCircle,
} from "lucide-react";
import styles from "./OrderConfirmation.module.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const { order, bankDetails, instructions } = location.state || {};

  const [copied, setCopied] = React.useState({
    accountNumber: false,
    reference: false,
  });

  if (!order) {
    return <Navigate to="/cart" replace />;
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => {
      setCopied({ ...copied, [field]: false });
    }, 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Success Header */}
        <div className={styles.successHeader}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={64} />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p className={styles.orderNumber}>Order #{order.order_number}</p>
        </div>

        {/* Main Content */}
        <div className={styles.contentGrid}>
          {/* Bank Transfer Instructions */}
          {bankDetails && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Building2 size={24} />
                <h2>Bank Transfer Instructions</h2>
              </div>

              <div className={styles.alert}>
                <AlertCircle size={20} />
                <p>Please complete your payment to confirm your order</p>
              </div>

              <div className={styles.bankDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Bank Name</span>
                  <span className={styles.value}>{bankDetails.bankName}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.label}>Account Name</span>
                  <span className={styles.value}>
                    {bankDetails.accountName}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.label}>Account Number</span>
                  <div className={styles.copyGroup}>
                    <span className={styles.value}>
                      {bankDetails.accountNumber}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          bankDetails.accountNumber,
                          "accountNumber",
                        )
                      }
                      className={styles.copyBtn}
                    >
                      {copied.accountNumber ? (
                        <>
                          <CheckCircle2 size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.label}>Amount</span>
                  <span className={`${styles.value} ${styles.amount}`}>
                    ₦
                    {bankDetails.amount.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.label}>Reference</span>
                  <div className={styles.copyGroup}>
                    <span className={styles.value}>
                      {bankDetails.reference}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(bankDetails.reference, "reference")
                      }
                      className={styles.copyBtn}
                    >
                      {copied.reference ? (
                        <>
                          <CheckCircle2 size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {instructions && (
                <div className={styles.instructions}>
                  <FileText size={20} />
                  <p>{instructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Package size={24} />
              <h2>Order Summary</h2>
            </div>

            <div className={styles.orderDetails}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Order Number</span>
                <span className={styles.value}>{order.order_number}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Total Amount</span>
                <span className={`${styles.value} ${styles.amount}`}>
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Payment Status</span>
                <span
                  className={`${styles.badge} ${styles[order.payment_status]}`}
                >
                  {order.payment_status === "pending" && <Clock size={14} />}
                  {order.payment_status.charAt(0).toUpperCase() +
                    order.payment_status.slice(1)}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Order Status</span>
                <span
                  className={`${styles.badge} ${styles[order.order_status]}`}
                >
                  {order.order_status.charAt(0).toUpperCase() +
                    order.order_status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className={styles.nextSteps}>
          <h3>What's Next?</h3>
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <strong>Complete Payment</strong>
                <p>
                  Transfer the exact amount to the bank account provided above
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <strong>Payment Confirmation</strong>
                <p>We'll confirm your payment within 24 hours</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <strong>Order Processing</strong>
                <p>Your order will be processed and shipped immediately</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <strong>Track Your Order</strong>
                <p>You'll receive tracking information via email</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link to="/orders" className={styles.primaryBtn}>
            <Package size={20} />
            View My Orders
          </Link>
          <Link to="/" className={styles.secondaryBtn}>
            Continue Shopping
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
