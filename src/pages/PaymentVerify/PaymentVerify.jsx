import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader,
  Package,
  ArrowRight,
} from "lucide-react";
import styles from "./PaymentVerify.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, failed
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failed");
        setError("No payment reference found");
        return;
      }

      console.log("🔍 Verifying payment:", reference);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/paystack/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log("📥 Verification response:", data);

      if (data.success) {
        console.log("✅ Payment verified successfully!");
        setStatus("success");
        setPaymentData(data.data);

        // Redirect to success page after 3 seconds
        setTimeout(() => {
          navigate("/order-success", {
            state: {
              reference: data.data.reference,
              amount: data.data.amount,
            },
          });
        }, 3000);
      } else {
        console.log("❌ Payment verification failed");
        setStatus("failed");
        setError(data.error || data.message || "Payment verification failed");
      }
    } catch (err) {
      console.error("💥 Verification error:", err);
      setStatus("failed");
      setError("Failed to verify payment");
    }
  };

  if (status === "verifying") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.card}>
            <Loader size={64} className={styles.spinner} />
            <h1>Verifying Your Payment</h1>
            <p>Please wait while we confirm your transaction...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={`${styles.card} ${styles.success}`}>
            <div className={styles.iconWrapper}>
              <CheckCircle size={80} />
            </div>
            <h1>Payment Successful!</h1>
            <p>
              Your payment has been confirmed and your order is being processed.
            </p>

            {paymentData && (
              <div className={styles.details}>
                <div className={styles.detailRow}>
                  <span>Reference:</span>
                  <strong>{paymentData.reference}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span>Amount:</span>
                  <strong>
                    ₦{parseFloat(paymentData.amount).toLocaleString()}
                  </strong>
                </div>
              </div>
            )}

            <p className={styles.redirectText}>
              Redirecting to order confirmation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.failed}`}>
          <div className={styles.iconWrapper}>
            <XCircle size={80} />
          </div>
          <h1>Payment Failed</h1>
          <p>{error || "We couldn't verify your payment. Please try again."}</p>

          <div className={styles.actions}>
            <button
              onClick={() => navigate("/cart")}
              className={styles.primaryBtn}
            >
              <Package size={20} />
              Back to Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className={styles.secondaryBtn}
            >
              Try Again
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerify;
